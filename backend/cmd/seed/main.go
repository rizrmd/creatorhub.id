package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var firstNames = []string{
	"Andi", "Budi", "Citra", "Dewi", "Eko", "Fitri", "Galih", "Hana",
	"Indra", "Joko", "Kartika", "Lina", "Mulia", "Neni", "Okta", "Putri",
	"Qori", "Rini", "Sari", "Tari", "Umi", "Vira", "Wati", "Xena",
	"Yoga", "Zahra", "Arif", "Bagas", "Cahya", "Dian",
}

var lastNames = []string{
	"Santoso", "Wijaya", "Susanto", "Prasetyo", "Kusuma", "Wibowo",
	"Setiawan", "Rahayu", "Permata", "Nugroho", "Saputra", "Hidayat",
	"Firmansyah", "Adiputra", "Budiman", "Gunawan", "Hartono", "Irawan",
}

var categories = []string{"lifestyle", "travel", "beauty", "tech", "food", "sports"}
var platforms = [][]string{
	{"instagram"},
	{"tiktok"},
	{"youtube"},
	{"instagram", "tiktok"},
	{"instagram", "youtube"},
	{"tiktok", "youtube"},
	{"instagram", "tiktok", "youtube"},
}
var cities = []string{
	"Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta",
	"Medan", "Makassar", "Balikpapan", "Semarang", "Palembang", "Manado",
}

func formatFollowers(n int64) string {
	if n >= 1_000_000 {
		return fmt.Sprintf("%.1fM", float64(n)/1_000_000)
	}
	return fmt.Sprintf("%dK", n/1_000)
}

func formatRupiah(n int64) string {
	if n >= 1_000_000 {
		return fmt.Sprintf("Rp %d.000.000", n/1_000_000)
	}
	return fmt.Sprintf("Rp %d.000", n/1_000)
}

func main() {
	_ = godotenv.Load()
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://postgres:postgres@localhost:5432/creatorhub?sslmode=disable"
	}

	pool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		log.Fatal("connect:", err)
	}
	defer pool.Close()

	count := 0
	for i := 0; i < 1000; i++ {
		first := firstNames[rand.Intn(len(firstNames))]
		last := lastNames[rand.Intn(len(lastNames))]
		name := first + " " + last
		id := fmt.Sprintf("gen-%04d", i+1)
		city := cities[rand.Intn(len(cities))]
		cat := categories[rand.Intn(len(categories))]
		followers := int64(50_000 + rand.Intn(1_350_000))
		followersText := formatFollowers(followers)
		engagement := 2.0 + rand.Float64()*6.0
		price := int64((1_000_000 + rand.Intn(20_000_000)) / 500_000 * 500_000)
		priceText := formatRupiah(price)
		verified := rand.Float32() < 0.4
		rating := 3.5 + rand.Float64()*1.4
		fastResponse := rand.Float32() < 0.5
		topRated := rand.Float32() < 0.2
		bio := fmt.Sprintf("Content creator %s dari %s dengan fokus pada konten %s.", name, city, cat)

		_, err := pool.Exec(context.Background(), `
			INSERT INTO creators (id, name, city, country, category, followers, followers_text,
				engagement_rate, price, price_text, verified, rating, fast_response, top_rated, image_url, bio)
			VALUES ($1,$2,$3,'Indonesia',$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'',$14)
			ON CONFLICT (id) DO NOTHING`,
			id, name, city, cat, followers, followersText,
			engagement, price, priceText, verified, rating, fastResponse, topRated, bio,
		)
		if err != nil {
			log.Printf("insert creator %s: %v", id, err)
			continue
		}

		plats := platforms[rand.Intn(len(platforms))]
		for _, p := range plats {
			_, _ = pool.Exec(context.Background(),
				`INSERT INTO creator_platforms (creator_id, platform) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
				id, p)
		}
		count++
	}

	log.Printf("Seeded %d generated creators", count)
}
