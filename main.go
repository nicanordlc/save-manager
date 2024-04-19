package main

import (
	"embed"

	"github.com/cabaalexander/save-manager/backend"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := backend.NewApp()
	appMenu := backend.NewMenu(app)
	appSize := 600

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Save Manager",
		Width:     appSize,
		Height:    appSize,
		MinWidth:  appSize,
		MinHeight: appSize,
		// AlwaysOnTop:      true,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.Startup,
		Menu:             appMenu,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Bind: []interface{}{
			app,
		},
		Mac: &mac.Options{
			WebviewIsTransparent: true,
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: true,
				HideTitle:                  true,
			},
		},
		Debug: options.Debug{
			// OpenInspectorOnStartup: true,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
