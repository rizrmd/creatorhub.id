package main

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/creatorhub?sslmode=disable"
	}
	db, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	var count int64
	db.QueryRow(context.Background(), "SELECT COUNT(*) FROM creators").Scan(&count)
	fmt.Printf("Total creators: %d\n", count)

	var platCount int64
	db.QueryRow(context.Background(), "SELECT COUNT(*) FROM creator_platforms").Scan(&platCount)
	fmt.Printf("Total platform entries: %d\n", platCount)

	rows, _ := db.Query(context.Background(), "SELECT name, city, followers, followers_text, engagement_rate, img_path FROM creators ORDER BY followers DESC LIMIT 5")
	defer rows.Close()
	fmt.Println("\nTop 5 by followers:")
	for rows.Next() {
		var name, city, ft, ip string
		var f int64
		var er float64
		rows.Scan(&name, &city, &f, &ft, &er, &ip)
		fmt.Printf("  %-25s | %-20s | %8s followers | ER: %8.2f%% | photo: %s\n", name, city, ft, er, ip)
	}

	var withImg int64
	db.QueryRow(context.Background(), "SELECT COUNT(*) FROM creators WHERE img_path != ''").Scan(&withImg)
	fmt.Printf("\nCreators with local photo: %d\n", withImg)

	var categories map[string]int64
	categories = make(map[string]int64)
	catRows, _ := db.Query(context.Background(), "SELECT category, COUNT(*) FROM creators GROUP BY category ORDER BY COUNT(*) DESC")
	defer catRows.Close()
	fmt.Println("\nCategories:")
	for catRows.Next() {
		var cat string
		var c int64
		catRows.Scan(&cat, &c)
		categories[cat] = c
		fmt.Printf("  %-20s: %d\n", cat, c)
	}
}
