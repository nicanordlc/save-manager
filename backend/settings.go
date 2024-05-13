package backend

import (
	"context"
	"os"

	"github.com/cabaalexander/save-manager/backend/utils"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type JsonSettings struct {
	AlwaysOnTop           bool
	DefaultSavePath       string
	DefaultSavePathIsFile bool
}

type Settings struct {
	ctx      context.Context
	filename string
	JsonSettings
}

func (s *Settings) Startup(ctx context.Context) {
	s.ctx = ctx
	s.filename = "settings.json"
	utils.CreateConfigJsonIfNoExists[JsonSettings](s.filename)
	utils.CreateSavesDirIfNoExists()

	settings, errSettings := s.ReadSettings()
	if errSettings != nil {
		panic(errSettings)
	}
	s.JsonSettings = *settings

	// initialize settings
	if settings.AlwaysOnTop {
		rt.WindowSetAlwaysOnTop(s.ctx, true)
	}
	if settings.DefaultSavePath == "" {
		path, _ := os.UserConfigDir()
		if path != "" {
			s.JsonSettings.DefaultSavePath = path
			s.JsonSettings.DefaultSavePathIsFile = false
			s.updateJson()
		}
	}
}

func (s *Settings) ToggleAlwaysOnTop() bool {
	isAlwaysOnTop := !s.AlwaysOnTop
	s.AlwaysOnTop = isAlwaysOnTop

	rt.WindowSetAlwaysOnTop(s.ctx, isAlwaysOnTop)
	s.updateJson()

	return isAlwaysOnTop
}

func (s *Settings) ReadSettings() (*JsonSettings, error) {
	settingsJson, err := utils.ReadConfigFrom[JsonSettings](s.filename)
	if err != nil {
		return settingsJson, err
	}
	return settingsJson, nil
}

func (s *Settings) SetDefaultSavePath(path string, isFile bool) {
	s.JsonSettings.DefaultSavePath = path
	s.JsonSettings.DefaultSavePathIsFile = isFile
	s.updateJson()
}

func NewSettings() *Settings {
	return &Settings{}
}

func (s *Settings) updateJson() error {
	return utils.WriteStructTo(s.filename, s.JsonSettings)
}
