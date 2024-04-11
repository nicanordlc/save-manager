package main

import (
	"runtime"

	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

func NewMenu(app *App) *menu.Menu {
	appMenu := menu.NewMenu()

	addSaveManagerMenu(app, appMenu)

	if runtime.GOOS == "darwin" {
		appMenu.Append(menu.EditMenu())
	}

	return appMenu
}

func addSaveManagerMenu(app *App, appMenu *menu.Menu) {
	fileMenu := appMenu.AddSubmenu("Save Manager")
	fileMenu.AddText("Quit", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		rt.Quit(app.ctx)
	})
}
