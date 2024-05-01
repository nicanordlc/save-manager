package main

import (
	"context"
	"embed"

	"github.com/cabaalexander/save-manager/backend"
	"github.com/cabaalexander/save-manager/backend/utils"
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
	settings := backend.NewSettings()
	appMenu := backend.NewMenu()
	game := backend.NewGame()

	apps := []utils.StartAble{app, settings, game, appMenu}
	binds := []interface{}{app, settings, game}

	appSize := 600

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "Save Manager",
		Width:            appSize,
		Height:           appSize,
		MinWidth:         appSize,
		MinHeight:        appSize,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		Menu:             appMenu.Menu,
		Bind:             binds,
		OnStartup: func(ctx context.Context) {
			utils.StartApps(ctx, apps)
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Mac: &mac.Options{
			WebviewIsTransparent: true,
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: true,
				HideTitle:                  true,
			},
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
