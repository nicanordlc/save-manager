package backend

import (
	"context"
	"runtime"

	"github.com/cabaalexander/save-manager/backend/utils"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx      context.Context
	Settings *Settings
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
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

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}
