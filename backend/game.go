package backend

import (
	"context"

	"github.com/cabaalexander/save-manager/backend/utils"
	"github.com/google/uuid"
)

type GameSingle struct {
	UUID     uuid.UUID
	Name     string
	SavePath string
}

type GameJson struct {
	Data []GameSingle
}

type Game struct {
	ctx      context.Context
	filename string
	GameJson
}

func (g *Game) Startup(ctx context.Context) {
	g.ctx = ctx
	g.filename = "game.json"
	utils.CreateConfigJsonIfNoExists[GameJson](g.filename)

	game, err := g.ReadGames()
	if err != nil {
		panic(err)
	}
	g.GameJson = *game
}

func (g *Game) AddGame(name string, savePath string) uuid.UUID {
	uuid := uuid.New()
	game := GameSingle{UUID: uuid, Name: name, SavePath: savePath}
	g.GameJson.Data = append(g.GameJson.Data, game)
	utils.WriteStructTo(g.filename, g.GameJson)
	return uuid
}

func (g *Game) ReadGames() (*GameJson, error) {
	gameJson, err := utils.ReadConfigFrom[GameJson](g.filename)
	if err != nil {
		return gameJson, err
	}
	return gameJson, nil
}

func NewGame() *Game {
	return &Game{}
}
