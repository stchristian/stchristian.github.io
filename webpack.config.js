const path = require("path");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");

module.exports = {
  output: {
    path: path.join(process.cwd(), "docs"),
  },
  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        // define templates here
        index: {
          import: "src/index.hbs", // template file
          data: "src/data.json", // pass variables into template
        },
      },
      preprocessor: "handlebars",
      preprocessorOptions: {
        partials: ["src/partials"],
        helpers: {
          ifEquals: function (arg1, arg2, options) {
            return arg1 == arg2 ? options.fn(this) : options.inverse(this);
          },
        },
      },
      js: {
        // output filename of compiled JavaScript, used if `inline` option is false (defaults)
        filename: "assets/js/[name].[contenthash:8].js",
        //inline: true, // inlines JS into HTML
      },
      css: {
        // output filename of extracted CSS, used if `inline` option is false (defaults)
        filename: "assets/css/[name].[contenthash:8].css",
        //inline: true, // inlines CSS into HTML
      },
      loaderOptions: {
        sources: [
          {
            tag: "meta",
            attributes: ["content"],
            // allow to handlen an image in the 'content' attribute of the 'meta' tag
            // when the 'property' attribute contains one of: 'og:image', 'og:video'
            filter: ({ attributes }) => {
              const attrName = "property";
              const attrValues = ["og:image", "og:video"]; // allowed values of the property
              if (!attributes[attrName] || attrValues.indexOf(attributes[attrName]) < 0) {
                return false; // return false to disable processing
              }
              // return true or undefined to enable processing
            },
          },
        ],
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ico|png|jp?g|webp|svg)$/,
        oneOf: [
          // inline image using `?inline` query
          {
            resourceQuery: /inline/,
            type: "asset/inline",
          },
          {
            type: "asset/resource",
            generator: {
              filename: "assets/img/[name].[hash:8][ext][query]",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
};
