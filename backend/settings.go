package backend

import (
	"context"

	"github.com/cabaalexander/save-manager/backend/utils"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type SettingsJson struct {
	AlwaysOnTop bool
}

type Settings struct {
	ctx      context.Context
	filename string
	SettingsJson
}

func (s *Settings) Startup(ctx context.Context) {
	s.ctx = ctx
	s.filename = "settings.json"
	utils.CreateConfigJsonIfNoExists[SettingsJson](s.filename)

	settings, errSettings := s.ReadSettings()
	if errSettings != nil {
		panic(errSettings)
	}
	s.SettingsJson = *settings

	// initialize settings
	if settings.AlwaysOnTop {
		rt.WindowSetAlwaysOnTop(s.ctx, true)
	}
}

func (s *Settings) ToggleAlwaysOnTop() bool {
	isAlwaysOnTop := !s.AlwaysOnTop
	s.AlwaysOnTop = isAlwaysOnTop

	rt.WindowSetAlwaysOnTop(s.ctx, isAlwaysOnTop)
	utils.WriteStructTo(s.filename, s.SettingsJson)

	return isAlwaysOnTop
}

func (s Settings) ReadSettings() (*SettingsJson, error) {
	settingsJson, err := utils.ReadConfigFrom[SettingsJson](s.filename)
	if err != nil {
		return settingsJson, err
	}
	return settingsJson, nil
}

func NewSettings() *Settings {
	return &Settings{}
}
