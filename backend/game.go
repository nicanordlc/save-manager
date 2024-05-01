package backend

import (
	"context"
	"fmt"

	"github.com/cabaalexander/save-manager/backend/utils"
	"github.com/google/uuid"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type GameSingle struct {
	UUID     uuid.UUID
	Name     string
	SavePath string
}

type JsonGame struct {
	Data []GameSingle
}

type Game struct {
	ctx      context.Context
	filename string
	JsonGame
}

func (g *Game) Startup(ctx context.Context) {
	g.ctx = ctx
	g.filename = "game.json"
	utils.CreateConfigJsonIfNoExists[JsonGame](g.filename)

	game, err := g.ReadGames()
	if err != nil {
		panic(err)
	}
	g.JsonGame = *game
}

func (g *Game) AddGame(name string, savePath string) uuid.UUID {
	uuid := uuid.New()
	game := GameSingle{UUID: uuid, Name: name, SavePath: savePath}
	g.JsonGame.Data = append(g.JsonGame.Data, game)
	g.updateJson()
	g.logf("Created: %v", uuid)
	return uuid
}

func (g *Game) RemoveGame(uuid uuid.UUID) {
	newList := []GameSingle{}
	for _, game := range g.JsonGame.Data {
		if game.UUID == uuid {
			continue
		}
		newList = append(newList, game)
	}
	g.JsonGame.Data = newList
	g.updateJson()
	g.logf("Deleted: %v", uuid)
}

func (g *Game) ReadGames() (*JsonGame, error) {
	gameJson, err := utils.ReadConfigFrom[JsonGame](g.filename)
	if err != nil {
		return gameJson, err
	}
	return gameJson, nil
}

func (g *Game) logf(format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	rt.LogDebugf(g.ctx, "[Game] %v", msg)
}

func (g *Game) updateJson() error {
	return utils.WriteStructTo(g.filename, g.JsonGame)
}

func NewGame() *Game {
	return &Game{}
}
