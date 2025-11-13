{
  "targets": [
    {
      "target_name": "dsa",
      "sources": [
        "src/index.cpp",
        "src/dsa_algos.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "conditions": [
        [ 'OS=="win"', {
          "msvs_settings": {
            "VCCLCompilerTool": { 
              "ExceptionHandling": 1,
              "LanguageStandard": "stdcpp17"
            }
          }
        }, {
          "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
            "CLANG_CXX_LIBRARY": "libc++",
            "MACOSX_DEPLOYMENT_TARGET": "10.15"
          },
          "cflags_cc": [ "-std=c++17", "-fexceptions" ]
        }]
      ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    }
  ]
}

