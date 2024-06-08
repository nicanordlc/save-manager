package backend

import (
	"context"
	"os"

	"github.com/cabaalexander/save-manager/backend/models"
	"github.com/cabaalexander/save-manager/backend/utils"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type JsonSettings struct {
	AlwaysOnTop           bool
	DefaultSavePath       string
	DefaultSavePathIsFile bool
}

type Settings struct {
	ctx context.Context
	models.Json[JsonSettings]
}

func (s *Settings) Startup(ctx context.Context) {
	s.ctx = ctx
	s.Filename = "settings.json"
	s.CreateConfigJsonIfNoExists()
	utils.CreateSavesDirIfNoExists()

	settings, errSettings := s.ReadData()
	if errSettings != nil {
		panic(errSettings)
	}
	s.JsonData = *settings

	// initialize settings
	if settings.AlwaysOnTop {
		rt.WindowSetAlwaysOnTop(s.ctx, true)
	}
	if settings.DefaultSavePath == "" {
		path, _ := os.UserConfigDir()
		if path != "" {
			s.JsonData.DefaultSavePath = path
			s.JsonData.DefaultSavePathIsFile = false
			s.UpdateJson()
		}
	}
}

func (s *Settings) ToggleAlwaysOnTop() bool {
	isAlwaysOnTop := !s.JsonData.AlwaysOnTop
	s.JsonData.AlwaysOnTop = isAlwaysOnTop

	rt.WindowSetAlwaysOnTop(s.ctx, isAlwaysOnTop)
	s.UpdateJson()

	return isAlwaysOnTop
}

func (s *Settings) SetDefaultSavePath(path string, isFile bool) {
	s.JsonData.DefaultSavePath = path
	s.JsonData.DefaultSavePathIsFile = isFile
	s.UpdateJson()
}

func NewSettings() *Settings {
	return &Settings{}
}
