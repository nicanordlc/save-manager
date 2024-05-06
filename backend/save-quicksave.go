package backend

import (
	"os"
	"path"

	"github.com/cabaalexander/save-manager/backend/utils"
	"github.com/google/uuid"
)

const (
	quickSaveDirName = "quick-save"
)

func (s *Save) GetQuickSave(gameID uuid.UUID) (bool, error) {
	gameDir, err := GetGameDir(gameID)
	if err != nil {
		return false, err
	}
	files, err := os.ReadDir(gameDir)
	if err != nil {
		return false, err
	}
	for _, file := range files {
		if file.Name() == quickSaveDirName {
			return true, nil
		}
	}
	return false, nil
}

func (s *Save) AddQuicksave(gameID uuid.UUID) error {
	s.updateJson()
	s.createQuickSaveDir(gameID)
	s.copyGameContentQuickSave(gameID)
	s.logf("Created quicksave for: %v", gameID)
	return nil
}

func (s *Save) LoadQuickSave(gameID uuid.UUID) error {
	err := s.copySaveContentQuickSave(gameID)
	if err != nil {
		return err
	}
	return nil
}

func (s *Save) RemoveQuickSave(gameID uuid.UUID) error {
	s.updateJson()
	s.logf("Deleted quicksave for: %v", gameID)
	s.removeQuickSaveDir(gameID)
	return nil
}

func (s *Save) OpenQuickSaveDir(gameID uuid.UUID) error {
	quickSaveDir, err := s.getQuickSaveDir(gameID)
	if err != nil {
		return err
	}
	if err = utils.OpenPath(s.ctx, quickSaveDir); err != nil {
		return err
	}
	return nil
}

func (s *Save) copyGameContentQuickSave(gameID uuid.UUID) error {
	savePath, err := s.getQuickSaveDir(gameID)
	if err != nil {
		return err
	}
	gamePath, err := s.getGameContentPath(gameID)
	if err != nil {
		return err
	}
	err = utils.CopyDir(gamePath, savePath)
	if err != nil {
		return err
	}
	return nil
}

func (s *Save) copySaveContentQuickSave(gameID uuid.UUID) error {
	savePath, err := s.getQuickSaveDir(gameID)
	if err != nil {
		return err
	}
	gamePath, err := s.getGameContentPath(gameID)
	if err != nil {
		return err
	}
	if err = os.RemoveAll(gamePath); err != nil {
		return err
	}
	err = utils.CopyDir(savePath, gamePath)
	if err != nil {
		return err
	}
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
	quickSaveDir := path.Join(gameDir, quickSaveDirName)
	return quickSaveDir, nil
}
