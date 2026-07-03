package main

import "testing"

func TestExtractHandleFromAllstarsDetailURL(t *testing.T) {
	tests := []struct {
		name string
		link string
		want string
	}{
		{
			name: "detail URL with handle",
			link: "https://www.allstars.id/influencer/detail/1234567/instagram/creator_name?ref=region",
			want: "creator_name",
		},
		{
			name: "detail URL without handle",
			link: "https://www.allstars.id/influencer/detail/7558639/youtube?ref=region",
			want: "",
		},
		{
			name: "non detail URL falls back to last path segment",
			link: "https://example.com/@creator_name",
			want: "creator_name",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := extractHandle(tt.link); got != tt.want {
				t.Fatalf("extractHandle(%q) = %q, want %q", tt.link, got, tt.want)
			}
		})
	}
}

func TestResolvedHandleUsesDetailIDWhenAllstarsURLHasNoHandle(t *testing.T) {
	item := AllstarsItem{
		Link:     "https://www.allstars.id/influencer/detail/7558639/youtube?ref=region",
		Name:     "creator name",
		Platform: "youtube",
	}

	if got, want := resolvedHandle(item), ""; got != want {
		t.Fatalf("resolvedHandle() = %q, want %q", got, want)
	}
}

func TestResolvedHandlePrefersValidNameHandleForSlugifiedAllstarsURL(t *testing.T) {
	item := AllstarsItem{
		Link:     "https://www.allstars.id/influencer/detail/1234567/instagram/creator-name?ref=region",
		Name:     "creator_name",
		Platform: "instagram",
	}

	if got, want := resolvedHandle(item), "creator_name"; got != want {
		t.Fatalf("resolvedHandle() = %q, want %q", got, want)
	}
}

func TestParseFollowerString(t *testing.T) {
	tests := []struct {
		raw  string
		want int64
	}{
		{raw: "67.3k", want: 67300},
		{raw: "67,3k", want: 67300},
		{raw: "2.9m", want: 2900000},
		{raw: "2,9m", want: 2900000},
		{raw: "1,234", want: 1234},
		{raw: "1.234", want: 1234},
	}

	for _, tt := range tests {
		t.Run(tt.raw, func(t *testing.T) {
			if got := parseFollowerString(tt.raw); got != tt.want {
				t.Fatalf("parseFollowerString(%q) = %d, want %d", tt.raw, got, tt.want)
			}
		})
	}
}

func TestParseEnRate(t *testing.T) {
	tests := []struct {
		name string
		raw  interface{}
		want float64
	}{
		{name: "numeric basis points", raw: float64(2421), want: 24.21},
		{name: "string basis points", raw: "116", want: 1.16},
		{name: "decimal comma basis points", raw: "2421,0", want: 24.21},
		{name: "percent string", raw: "24.21%", want: 24.21},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := parseEnRate(tt.raw); got != tt.want {
				t.Fatalf("parseEnRate(%v) = %v, want %v", tt.raw, got, tt.want)
			}
		})
	}
}
