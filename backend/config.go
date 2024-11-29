package backend

type ConfigJson struct{}

type Config struct {
	Json[ConfigJson]
}

func (c *Config) NewConfig() *Config {
	return &Config{}
}
