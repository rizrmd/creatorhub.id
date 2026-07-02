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
		Link: "https://www.allstars.id/influencer/detail/7558639/youtube?ref=region",
		Name: "creator name",
	}

	if got, want := resolvedHandle(item), "7558639"; got != want {
		t.Fatalf("resolvedHandle() = %q, want %q", got, want)
	}
}
