package backend

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path"
	"time"

	"github.com/cabaalexander/save-manager/backend/models"
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
	Data map[uuid.UUID][]SaveSingle
}

type Save struct {
	ctx  context.Context
	Game *Game
	models.Json[JsonSave]
}

func (s *Save) Startup(ctx context.Context) {
	s.ctx = ctx
	s.Filename = "save.json"
	s.CreateConfigJsonIfNoExists()

	save, err := s.ReadData()
	if err != nil {
		panic(err)
	}
	s.JsonData = *save
}

func (s *Save) AddSave(name string, gameID uuid.UUID) uuid.UUID {
	id := uuid.New()
	now := time.Now()
	save := SaveSingle{Name: name, ID: id, GameID: gameID, CreatedAt: now}
	if len(s.JsonData.Data) < 1 {
		s.JsonData.Data = make(map[uuid.UUID][]SaveSingle)
	}
	s.JsonData.Data[gameID] = append(s.JsonData.Data[gameID], save)
	s.UpdateJson()
	CreateSaveDir(id, gameID)
	s.copyGameContent(gameID, id)
	s.logf("Created: %v", id)
	return id
}

func (s *Save) LoadSave(saveID, gameID uuid.UUID) error {
	err := s.copySaveContent(saveID, gameID)
	if err != nil {
		return err
	}
	return nil
}

func (s *Save) OverwriteSave(saveID, gameID uuid.UUID) error {
	err := s.copyGameContent(gameID, saveID)
	if err != nil {
		return err
	}
	return nil
}

func (s *Save) GetSaves(gameID uuid.UUID) []SaveSingle {
	var gameSaves []SaveSingle
	for _, save := range s.JsonData.Data[gameID] {
		if save.GameID == gameID {
			gameSaves = append(gameSaves, save)
		}
	}
	return gameSaves
}

func (s *Save) UpdateSave(saveID, gameID uuid.UUID, name string) error {
	if name == "" {
		return errors.New("name is empty")
	}
	var newList []SaveSingle
	for _, save := range s.JsonData.Data[gameID] {
		if save.ID == saveID {
			save.Name = name
			save.CreatedAt = time.Now()
		}
		newList = append(newList, save)
	}
	s.JsonData.Data[gameID] = newList
	s.UpdateJson()
	return nil
}

func (s *Save) RemoveSave(saveID uuid.UUID, gameID uuid.UUID) error {
	var newList []SaveSingle
	for _, save := range s.JsonData.Data[gameID] {
		if save.ID == saveID {
			continue
		}
		newList = append(newList, save)
	}
	if len(newList) < 1 {
		s.JsonData.Data[gameID] = make([]SaveSingle, 0)
	} else {
		s.JsonData.Data[gameID] = newList
	}
	s.UpdateJson()
	s.logf("Deleted: %v", saveID)
	err := s.removeSaveDir(saveID, gameID)
	if err != nil {
		return err
	}
	return nil
}

func (s *Save) RemoveSaveForGame(gameID uuid.UUID) {
	s.JsonData.Data = make(map[uuid.UUID][]SaveSingle)
	s.UpdateJson()
}

func (s *Save) OpenSaveDir(saveID, gameID uuid.UUID) error {
	saveDir, err := GetSaveDir(saveID, gameID)
	if err != nil {
		return err
	}
	utils.BrowsePath(s.ctx, saveDir)
	return nil
}

func (s *Save) copyGameContent(gameID, saveID uuid.UUID) error {
	savePath, gamePath, err := s.getSaveAndGameContentPath(saveID, gameID)
	if err != nil {
		return err
	}
	err = utils.CopyDir(gamePath, savePath)
	if err != nil {
		return err
	}
	return nil
}

func (s *Save) copySaveContent(saveID, gameID uuid.UUID) error {
	savePath, gamePath, err := s.getSaveAndGameContentPath(saveID, gameID)
	if err != nil {
		return err
	}
	if err = utils.CopyDir(savePath, gamePath); err != nil {
		return err
	}
	return nil
}

func (s *Save) getGameContentPath(gameID uuid.UUID) (string, error) {
	for _, game := range s.Game.JsonData.Data {
		if game.ID == gameID {
			return game.SavePath, nil
		}
	}
	return "", errors.New("no game content found")
}

func (s *Save) getSaveAndGameContentPath(saveID, gameID uuid.UUID) (string, string, error) {
	gameContentPath, err := s.getGameContentPath(gameID)
	if err != nil {
		return "", "", err
	}
	saveContentPath, err := GetSaveDir(saveID, gameID)
	if err != nil {
		return "", "", err
	}
	return saveContentPath, gameContentPath, nil
}

func (s *Save) removeSaveDir(saveID uuid.UUID, gameID uuid.UUID) error {
	saveDir, err := GetSaveDir(saveID, gameID)
	if err != nil {
		return err
	}
	os.RemoveAll(saveDir)
	return nil
}

func (s *Save) logf(format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	rt.LogDebugf(s.ctx, "[Save] %v", msg)
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
