// Password Constraints
const PASSWORD_MIN_LENGTH: usize = 16;
static PASSWORD_TOO_SHORT: &str = "Password must be at least 16 characters long";
static PASSWORD_NO_SPACE: &str = "Password must contain at least one space";

pub fn validate_password(password: String) -> Result<(), String> {
    if password.len() < PASSWORD_MIN_LENGTH {
        return Err(PASSWORD_TOO_SHORT.into());
    }

    if !password.contains(" ") {
        return Err(PASSWORD_NO_SPACE.into());
    }

    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test() {
        assert!(validate_password("password".into()).is_err());
        assert!(validate_password("notenoughspacestopass".into()).is_err());
        assert!(validate_password("Thi$One Should Be Ju5t Fine".into()).is_ok());
    }
}
