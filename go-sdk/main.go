package main

import (
	"fmt"
	"net/http"

	spinhttp "github.com/fermyon/spin/sdk/go/http"
)

func init() {
	spinhttp.Handle(func(w http.ResponseWriter, r *http.Request) {
		_, err := spinhttp.Get("https://google.com")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		w.Header().Set("Content-Type", "text/plain")
		fmt.Fprintln(w, "")
	})
}

func main() {}
