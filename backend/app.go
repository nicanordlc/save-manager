package backend

import (
	"context"
	"runtime"

	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
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

func (a *App) OpenDirectoryDialog() string {
	path, err := rt.OpenDirectoryDialog(a.ctx, rt.OpenDialogOptions{})
	if err != nil {
		return ""
	}
	return path
}

func (a *App) OpenFileDialog() string {
	path, err := rt.OpenFileDialog(a.ctx, rt.OpenDialogOptions{})
	if err != nil {
		return ""
	}
	return path
}

func (a *App) GetOS() string {
	osName := runtime.GOOS
	return osName
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}
