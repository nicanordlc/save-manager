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
	Data             map[uuid.UUID][]SaveSingle
	QuickSaveEnabled bool
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
	if len(s.JsonSave.Data) < 1 {
		s.JsonSave.Data = make(map[uuid.UUID][]SaveSingle)
	}
	s.JsonSave.Data[gameID] = append(s.JsonSave.Data[gameID], save)
	s.updateJson()
	CreateSaveDir(id, gameID)
	s.logf("Created: %v", id)
	return id
}

func (s *Save) ReadSaves() (*JsonSave, error) {
	saveJson, err := utils.ReadConfigFrom[JsonSave](s.filename)
	return saveJson, err
}

func (s *Save) GetQuickSave() (bool, error) {
	saveJson, err := utils.ReadConfigFrom[JsonSave](s.filename)
	return saveJson.QuickSaveEnabled, err
}

func (s *Save) GetSaves(gameID uuid.UUID) []SaveSingle {
	var gameSaves []SaveSingle
	for _, save := range s.JsonSave.Data[gameID] {
		if save.GameID == gameID {
			gameSaves = append(gameSaves, save)
		}
	}
	return gameSaves
}

func (s *Save) RemoveSave(saveID uuid.UUID, gameID uuid.UUID) error {
	var newList []SaveSingle
	for _, save := range s.JsonSave.Data[gameID] {
		if save.ID == saveID {
			continue
		}
		newList = append(newList, save)
	}
	if len(newList) < 1 {
		s.JsonSave.Data = make(map[uuid.UUID][]SaveSingle)
	} else {
		s.JsonSave.Data[gameID] = newList
	}
	s.updateJson()
	s.logf("Deleted: %v", saveID)
	err := s.removeSaveDir(saveID, gameID)
	if err != nil {
		return err
	}
	return nil
}

func (s *Save) RemoveSaveForGame(gameID uuid.UUID) {
	s.JsonSave.Data = make(map[uuid.UUID][]SaveSingle)
	s.updateJson()
}

func (s *Save) removeSaveDir(saveID uuid.UUID, gameID uuid.UUID) error {
	saveDir, err := GetSaveDir(saveID, gameID)
	if err != nil {
		return err
	}
	os.RemoveAll(saveDir)
	return nil
}

func (s *Save) RemoveQuickSave(gameID uuid.UUID) error {
	s.QuickSaveEnabled = false
	s.updateJson()
	s.logf("Deleted quicksave for: %v", gameID)
	s.removeQuickSaveDir(gameID)
	return nil
}

func (s *Save) AddQuicksave(gameID uuid.UUID) error {
	s.QuickSaveEnabled = true
	s.updateJson()
	s.logf("Created quicksave for: %v", gameID)
	s.createQuickSaveDir(gameID)
	return nil
}

func (s *Save) createQuickSaveDir(gameID uuid.UUID) error {
	quickSaveDir, err := s.getQuickSaveDir(gameID)
	if err != nil {
		return err
	}
	os.Mkdir(quickSaveDir, os.ModePerm)
	return nil
}

func (s *Save) removeQuickSaveDir(gameID uuid.UUID) error {
	quickSaveDir, err := s.getQuickSaveDir(gameID)
	if err != nil {
		return err
	}
	os.RemoveAll(quickSaveDir)
	return nil
}

func (s *Save) getQuickSaveDir(gameID uuid.UUID) (string, error) {
	gameDir, err := GetGameDir(gameID)
	if err != nil {
		return "", err
	}
	quickSaveDir := path.Join(gameDir, "quick-save")
	return quickSaveDir, nil
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
