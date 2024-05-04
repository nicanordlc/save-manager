package backend

import (
	"context"
	"fmt"
	"os"
	"path"
	"time"

	"github.com/cabaalexander/save-manager/backend/utils"
	"github.com/google/uuid"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type SaveSingle struct {
	ID        uuid.UUID
	GameID    uuid.UUID
	CreatedAt time.Time
	Name      string
}

type JsonSave struct {
	Data []SaveSingle
}

type Save struct {
	ctx      context.Context
	filename string
	JsonSave
}

func (s *Save) Startup(ctx context.Context) {
	s.ctx = ctx
	s.filename = "save.json"
	utils.CreateConfigJsonIfNoExists[JsonSave](s.filename)

	save, err := s.ReadSaves()
	if err != nil {
		panic(err)
	}
	s.JsonSave = *save
}

func (s *Save) AddSave(name string, gameID uuid.UUID) uuid.UUID {
	id := uuid.New()
	now := time.Now()
	save := SaveSingle{Name: name, ID: id, GameID: gameID, CreatedAt: now}
	s.JsonSave.Data = append(s.JsonSave.Data, save)
	s.updateJson()
	CreateSaveDir(id, gameID)
	s.logf("Created: %v", id)
	return id
}

func (s *Save) ReadSaves() (*JsonSave, error) {
	saveJson, err := utils.ReadConfigFrom[JsonSave](s.filename)
	if err != nil {
		return saveJson, err
	}
	return saveJson, nil
}

func (s *Save) logf(format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	rt.LogDebugf(s.ctx, "[Save] %v", msg)
}

func (s *Save) updateJson() error {
	return utils.WriteStructTo(s.filename, s.JsonSave)
}

func CreateSaveDir(saveID uuid.UUID, gameID uuid.UUID) error {
	saveDir, err := GetSaveDir(saveID, gameID)
	if err != nil {
		return err
	}
	os.Mkdir(saveDir, os.ModePerm)
	return nil
}

func GetSaveDir(saveID uuid.UUID, gameID uuid.UUID) (string, error) {
	gameDir, err := GetGameDir(gameID)
	if err != nil {
		return "", err
	}
	saveLabel := fmt.Sprintf("save-%v", saveID)
	saveDir := path.Join(gameDir, saveLabel)
	return saveDir, nil
}

func NewSave() *Save {
	return &Save{}
}
