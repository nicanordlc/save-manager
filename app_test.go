package main

import (
	"context"
	"fmt"
	"testing"
)

func TestNewApp(t *testing.T) {
	got := fmt.Sprintf("%v", NewApp())
	want := "&{<nil>}"

	if got != want {
		t.Errorf("got %q want %q", got, want)
	}
}

func TestStartup(t *testing.T) {
	app := NewApp()
	app.startup(context.TODO())

	got := fmt.Sprintf("%v", app.ctx)
	want := "context.TODO"

	if got != want {
		t.Errorf("got %q want %q", got, want)
	}
}
