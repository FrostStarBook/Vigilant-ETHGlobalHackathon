{
  "_$ver": 1,
  "_$id": "9ek6mo9a",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "_$comp": [
    {
      "_$type": "1bce2083-60da-449d-ba27-ad79ee04766a",
      "scriptPath": "../src/game/Game.ts",
      "bg": {
        "_$ref": "hz2u1xvm"
      },
      "energy": {
        "_$ref": "xz6giyvc"
      },
      "loading": {
        "_$ref": "5ljzh2g4"
      }
    }
  ],
  "_$child": [
    {
      "_$id": "hz2u1xvm",
      "_$type": "Image",
      "name": "bg",
      "x": 960,
      "y": 540,
      "width": 200,
      "height": 200,
      "anchorX": 0.5,
      "anchorY": 0.5,
      "color": "#ffffff"
    },
    {
      "_$id": "5q80802c",
      "_$type": "Text",
      "name": "Text",
      "x": 60,
      "y": 80,
      "width": 200,
      "height": 32,
      "text": "Energy:",
      "font": "res://d542e490-8976-476e-910d-c53657a9c7eb",
      "fontSize": 32,
      "color": "#FFFFFF",
      "valign": "middle",
      "leading": 0
    },
    {
      "_$id": "xz6giyvc",
      "_$type": "Text",
      "name": "Energy",
      "x": 300,
      "y": 80,
      "width": 120,
      "height": 32,
      "text": "0",
      "font": "res://d542e490-8976-476e-910d-c53657a9c7eb",
      "fontSize": 32,
      "color": "#FFFFFF",
      "valign": "middle",
      "leading": 0
    },
    {
      "_$id": "5ljzh2g4",
      "_$type": "Image",
      "name": "loading",
      "width": 1920,
      "height": 1080,
      "centerX": 0,
      "centerY": 0,
      "skin": "res://00000000-0000-0000-0001-000000000001",
      "color": "#ffffff",
      "_$child": [
        {
          "_$id": "clbqefzm",
          "_$type": "Label",
          "name": "Label",
          "x": 960,
          "y": 540,
          "width": 1680,
          "height": 48,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "centerX": 0,
          "centerY": 0,
          "text": "loading...",
          "font": "res://d542e490-8976-476e-910d-c53657a9c7eb",
          "fontSize": 48,
          "color": "#FFFFFF",
          "align": "center",
          "valign": "middle",
          "leading": 0,
          "padding": "0,0,0,0"
        }
      ]
    }
  ]
}