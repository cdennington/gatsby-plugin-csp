# gatsby-plugin-firebase-csp

[Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement to distribution of malware.

`gatsby-plugin-firebase-csp` by default creates strict policy, generates script and style hashes then adds `Content-Security-Policy` to the firebase.json file.

## Install

`npm install --save git+https://github.com/cdennington/gatsby-plugin-csp`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [`gatsby-plugin-firebase-csp`]
};
```

Default Policy:

```
base-uri 'self';
script-src 'self' 'sha256-iF/...GM=' 'sha256-BOv...L4=';
style-src 'self' 'sha256-WCK...jU=';
object-src 'none';
form-action 'self';
font-src 'self' data:;
img-src 'self' data:;
```

Default Firebase JSON:

```
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "functions": {
      "predeploy": [
        "npm --prefix \"$RESOURCE_DIR\" run lint"
      ]
    },
    "headers": [
      {
        "source": "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      },
      {
        "source": "404.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=300"
          }
        ]
      }
    ]
  },
  "emulators": {
    "functions": {
      "port": 5001
    },
    "hosting": {
      "port": 5000
    },
    "pubsub": {
      "port": 8085
    },
    "ui": {
      "enabled": true
    }
  }
}
```

sha256 for every inline script and style is generated automatically during the build process and appended to its directive (`script-src` or `style-src`).

## Options

Strict CSP can break a lot of things you use on your website, especially 3rd party scripts like Google Analytics. To allow your 3rd party scripts running, you can adjust the policy through the plugin options.

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-firebase-csp`,
      options: {
        disableOnDev: true,
        mergeScriptHashes: true, // you can disable scripts sha256 hashes
        mergeStyleHashes: true, // you can disable styles sha256 hashes
        mergeDefaultDirectives: true,
        nonce: 'astrongstring',
        directives: {
          "script-src": "'strict-dynamic' 'nonce-astrongstring' 'self' 'unsafe-inline' www.google-analytics.com",
          "style-src": "'self' 'unsafe-inline' 'unsafe-inline'",
          "img-src": "'self' data: www.google-analytics.com"
          // you can add your directives or override defaults
        },
        hosting: {
          "hosting": {
            "public": "public",
            "ignore": [
              "firebase.json",
              "**/.*",
              "**/node_modules/**"
            ],
            "functions": {
              "predeploy": [
                "npm --prefix \"$RESOURCE_DIR\" run lint"
              ]
            },
            "headers": [
              {
                "source": "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
                "headers": [
                  {
                    "key": "Access-Control-Allow-Origin",
                    "value": "*"
                  }
                ]
              },
              {
                "source": "**/*.@(js|css)",
                "headers": [
                  {
                    "key": "Cache-Control",
                    "value": "max-age=604800"
                  }
                ]
              },
              {
                "source": "**/*.@(jpg|jpeg|gif|png)",
                "headers": [
                  {
                    "key": "Cache-Control",
                    "value": "max-age=604800"
                  }
                ]
              },
              {
                "source": "404.html",
                "headers": [
                  {
                    "key": "Cache-Control",
                    "value": "max-age=300"
                  }
                ]
              }
            ]
          },
          "emulators": {
            "functions": {
              "port": 5001
            },
            "hosting": {
              "port": 5000
            },
            "pubsub": {
              "port": 8085
            },
            "ui": {
              "enabled": true
            }
          }
        }
      }
    }
  ]
};
```

## Further reading

- [Improving Security of Gatsby Websites and Apps by Implementing a Strict CSP](https://bejamas.io/blog/content-security-policy-gatsby-websites/)
