package backend

import (
	"context"
	"runtime"

	"github.com/cabaalexander/save-manager/backend/models"
	"github.com/cabaalexander/save-manager/backend/utils"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type JsonApp struct {
	Size struct {
		Width  int
		Height int
	}
}

type App struct {
	ctx      context.Context
	Settings *Settings
	models.Json[JsonApp]
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	a.Filename = "app.json"
	a.CreateConfigJsonIfNoExists()

	app, err := a.ReadData()
	if err != nil {
		panic(err)
	}
	if app.Size.Width != 0 && app.Size.Height != 0 {
		a.JsonData.Size = app.Size
		rt.WindowSetSize(a.ctx, app.Size.Width, app.Size.Height)
	}
}

func (a *App) ToggleFullScreen() {
	if rt.WindowIsFullscreen(a.ctx) {
		rt.WindowUnfullscreen(a.ctx)
	} else {
		rt.WindowFullscreen(a.ctx)
	}
}

func (a *App) OpenDialogDirApp() (string, error) {
	return utils.OpenDialogDir(a.ctx, a.Settings.JsonData.DefaultSavePath, false)
}

func (a *App) OpenDialogFileApp() (string, error) {
	return utils.OpenDialogFile(a.ctx, a.Settings.JsonData.DefaultSavePath, true)
}

func (a *App) GetOS() string {
	osName := runtime.GOOS
	return osName
}

func (a *App) UpdateAppSize(width, height int) error {
	a.JsonData.Size.Width = width
	a.JsonData.Size.Height = height
	return a.UpdateJson()
}

func NewApp() *App {
	return &App{}
}
