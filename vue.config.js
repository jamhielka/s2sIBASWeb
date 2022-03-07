module.exports = {
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
          args[0].title = "IBAS";
          return args;
        });
      },
    "transpileDependencies": [
        "vuetify"
    ],
    publicPath: '/'
}