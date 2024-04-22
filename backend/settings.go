package backend

import (
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type Settings struct {
	app         *App
	alwaysOnTop bool
}

func (s *Settings) ToggleAlwaysOnTop() bool {
	isAlwaysOnTop := !s.alwaysOnTop
	s.alwaysOnTop = isAlwaysOnTop

	rt.WindowSetAlwaysOnTop(s.app.ctx, isAlwaysOnTop)

	return isAlwaysOnTop
}

func NewSettings(a *App) *Settings {
	return &Settings{app: a}
}
