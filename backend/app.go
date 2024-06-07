package backend

import (
	"context"
	"runtime"

	"github.com/cabaalexander/save-manager/backend/utils"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type JsonApp struct {
	Size struct {
		Width  int
		Height int
	}
}

// App struct
type App struct {
	ctx      context.Context
	filename string
	Settings *Settings
	JsonApp
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	a.filename = "app.json"
	utils.CreateConfigJsonIfNoExists[JsonApp](a.filename)

	app, err := a.ReadApp()
	if err != nil {
		panic(err)
	}
	if a.Size == struct {
		Width  int
		Height int
	}{} {
		a.Size = app.Size
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
	return utils.OpenDialogDir(a.ctx, a.Settings.DefaultSavePath, false)
}

func (a *App) OpenDialogFileApp() (string, error) {
	return utils.OpenDialogFile(a.ctx, a.Settings.DefaultSavePath, true)
}

func (a *App) GetOS() string {
	osName := runtime.GOOS
	return osName
}

func (a *App) UpdateAppSize(width, height int) error {
	a.Size.Width = width
	a.Size.Height = height
	return a.updateJson()
}

func (a *App) ReadApp() (*JsonApp, error) {
	appJson, err := utils.ReadConfigFrom[JsonApp](a.filename)
	if err != nil {
		return appJson, err
	}
	return appJson, nil
}

func (a *App) updateJson() error {
	return utils.WriteStructTo(a.filename, a.JsonApp)
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}
