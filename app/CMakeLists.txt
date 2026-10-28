cmake_minimum_required(VERSION 3.20)
project(Nollterm VERSION 2.0.0 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
  set(CMAKE_BUILD_TYPE Release)
endif()

if(MSVC)
  # Statisk körtidsmiljö: .exe-filen kräver inga extra DLL:er från Visual Studio.
  set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
  add_compile_options(/utf-8)   # källfilerna är UTF-8 (å, ä, ö)
endif()
if(MINGW)
  # Länka in libstdc++ och winpthread i .exe-filen, så att den startar utan extra DLL:er.
  add_link_options(-static -static-libgcc -static-libstdc++)
endif()

# ---------------------------------------------------------------- tredjepartsbibliotek
# Hämtas automatiskt av CMake första gången du bygger.
include(FetchContent)

FetchContent_Declare(json
  URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE)

set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(GLFW_INSTALL OFF CACHE BOOL "" FORCE)
FetchContent_Declare(glfw
  GIT_REPOSITORY https://github.com/glfw/glfw.git
  GIT_TAG 3.4
  GIT_SHALLOW TRUE)

FetchContent_Declare(imgui
  GIT_REPOSITORY https://github.com/ocornut/imgui.git
  GIT_TAG v1.91.5
  GIT_SHALLOW TRUE)

# Kodredigeraren med syntaxfärgning (fastlåst på en version som fungerar med ImGui 1.91)
FetchContent_Declare(texteditor
  GIT_REPOSITORY https://github.com/BalazsJako/ImGuiColorTextEdit.git
  GIT_TAG ca2f9f1462e3b60e56351bc466acda448c5ea50d)

FetchContent_MakeAvailable(json)

# ---------------------------------------------------------------- kärnan (ingen grafik)
add_library(nollterm_core STATIC
  src/core/Language.cpp
  src/core/Question.cpp
  src/core/QuestionFactory.cpp
  src/core/Content.cpp
  src/core/Exam.cpp
  src/core/Progress.cpp
  src/run/Process.cpp
  src/run/LanguageRunner.cpp
  src/run/Judge.cpp)
target_include_directories(nollterm_core PUBLIC src)
target_link_libraries(nollterm_core PUBLIC nlohmann_json::nlohmann_json)
if(NOT WIN32)
  find_package(Threads REQUIRED)
  target_link_libraries(nollterm_core PUBLIC Threads::Threads)
endif()

# Kommandoradsverktyget för tester
add_executable(nollterm-check src/check_main.cpp)
target_link_libraries(nollterm-check PRIVATE nollterm_core)

# ---------------------------------------------------------------- grafiska appen
option(NOLLTERM_GUI "Bygg den grafiska appen (kräver OpenGL)" ON)
if(NOLLTERM_GUI)
  FetchContent_MakeAvailable(glfw)
  FetchContent_GetProperties(imgui)
  if(NOT imgui_POPULATED)
    FetchContent_Populate(imgui)
  endif()
  FetchContent_GetProperties(texteditor)
  if(NOT texteditor_POPULATED)
    FetchContent_Populate(texteditor)
  endif()
  find_package(OpenGL REQUIRED)

  add_library(imgui STATIC
    ${imgui_SOURCE_DIR}/imgui.cpp
    ${imgui_SOURCE_DIR}/imgui_draw.cpp
    ${imgui_SOURCE_DIR}/imgui_tables.cpp
    ${imgui_SOURCE_DIR}/imgui_widgets.cpp
    ${imgui_SOURCE_DIR}/misc/cpp/imgui_stdlib.cpp
    ${imgui_SOURCE_DIR}/backends/imgui_impl_glfw.cpp
    ${imgui_SOURCE_DIR}/backends/imgui_impl_opengl3.cpp
    ${texteditor_SOURCE_DIR}/TextEditor.cpp)
  target_include_directories(imgui PUBLIC ${imgui_SOURCE_DIR} ${imgui_SOURCE_DIR}/backends
                                          ${imgui_SOURCE_DIR}/misc/cpp ${texteditor_SOURCE_DIR})
  target_link_libraries(imgui PUBLIC glfw OpenGL::GL)

  set(GUI_SOURCES
    src/main.cpp
    src/ui/Theme.cpp
    src/ui/RichText.cpp
    src/ui/CodeView.cpp
    src/ui/QuestionView.cpp
    src/ui/App.cpp
    src/ui/ViewsCourse.cpp
    src/ui/ViewExam.cpp
    src/ui/ViewLab.cpp
    src/ui/Widgets.cpp)
  if(WIN32)
    list(APPEND GUI_SOURCES assets/nollterm.rc)
  endif()
  add_executable(Nollterm WIN32 ${GUI_SOURCES})   # WIN32 = inget konsolfönster
  target_link_libraries(Nollterm PRIVATE nollterm_core imgui)
endif()
