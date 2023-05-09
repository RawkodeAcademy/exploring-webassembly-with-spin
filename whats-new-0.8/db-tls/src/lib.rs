use anyhow::Result;
use spin_sdk::{
    http::{Request, Response},
    http_component,
    pg::{self, Decode},
};

const DB_URL_ENV: &str = "DB_URL";

#[derive(Debug, Clone)]
struct Show {
    id: String,
    name: String,
}

impl TryFrom<&pg::Row> for Show {
    type Error = anyhow::Error;

    fn try_from(row: &pg::Row) -> Result<Self, Self::Error> {
        let id = String::decode(&row[0])?;
        let name = String::decode(&row[1])?;

        Ok(Self { id, name })
    }
}

fn format_col(column: &pg::Column) -> String {
    format!("{}:{:?}", column.name, column.data_type)
}

#[http_component]
fn handle_db_tls(req: Request) -> Result<Response> {
    let address = std::env::var(DB_URL_ENV)?;

    let sql = "SELECT id, name FROM shows";
    let rowset = pg::query(&address, sql, &[])?;

    let column_summary = rowset
        .columns
        .iter()
        .map(format_col)
        .collect::<Vec<_>>()
        .join(", ");

    let mut response_lines = vec![];

    for row in rowset.rows {
        let show = Show::try_from(&row)?;

        println!("show: {:#?}", show);
        response_lines.push(format!("show: {:#?}", show));
    }

    // use it in business logic

    let response = format!(
        "Found {} show(s) as follows:\n{}\n\n(Column info: {})\n",
        response_lines.len(),
        response_lines.join("\n"),
        column_summary,
    );

    Ok(http::Response::builder()
        .status(200)
        .body(Some(response.into()))?)
}
