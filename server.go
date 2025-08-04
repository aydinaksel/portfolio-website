package main

import (
	"log"
	"net/http"
)

func main() {
	const addr = ":1234"
	fs := http.FileServer(http.Dir("."))
	log.Printf("Serving on http://localhost%s ...\n", addr)
	log.Fatal(http.ListenAndServe(addr, fs))
}
