// Nollterm – startpunkten.
//
// 1. Skapa ett fönster med GLFW och en OpenGL-kontext.
// 2. Starta Dear ImGui och ladda typsnitt.
// 3. Läs in kurserna från content/ och hitta kompilatorerna.
// 4. Huvudloopen: hantera händelser, rita App, visa bilden. Upprepa tills fönstret stängs.

#include <cstdio>
#include <string>

#include <GLFW/glfw3.h>
#include <imgui.h>
#include <imgui_impl_glfw.h>
#include <imgui_impl_opengl3.h>

#include "ui/App.h"
#include "ui/Theme.h"

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#endif

namespace fs = std::filesystem;

// Mappen där programmet ligger, så att vi hittar content/, assets/ och toolchain/.
static fs::path executableDir() {
#ifdef _WIN32
    wchar_t buf[MAX_PATH];
    GetModuleFileNameW(nullptr, buf, MAX_PATH);
    return fs::path(buf).parent_path();
#else
    std::error_code ec;
    fs::path p = fs::read_symlink("/proc/self/exe", ec);
    return ec ? fs::current_path() : p.parent_path();
#endif
}

static fs::path findAssets(const fs::path& start) {
    for (fs::path p = start; !p.empty(); p = p.parent_path()) {
        if (fs::exists(p / "assets" / "fonts")) return p / "assets";
        if (fs::exists(p / "app" / "assets" / "fonts")) return p / "app" / "assets";
        if (p == p.parent_path()) break;
    }
    if (start != fs::current_path()) return findAssets(fs::current_path());
    return start / "assets";
}

static void glfwError(int code, const char* msg) { std::fprintf(stderr, "GLFW-fel %d: %s\n", code, msg); }

#ifdef _WIN32
int WINAPI WinMain(HINSTANCE, HINSTANCE, LPSTR, int) {
#else
int main() {
#endif
    glfwSetErrorCallback(glfwError);
    if (!glfwInit()) return 1;

    // OpenGL 3.0 räcker för ImGui och fungerar på i princip alla datorer.
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 0);
    glfwWindowHint(GLFW_SCALE_TO_MONITOR, GLFW_TRUE);
    GLFWwindow* window = glfwCreateWindow(1320, 880, "Nollterm", nullptr, nullptr);
    if (!window) return 1;
    glfwMakeContextCurrent(window);
    glfwSwapInterval(1);  // vsync: max en bild per skärmuppdatering

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    io.IniFilename = nullptr;  // vi sparar inga fönsterpositioner
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
    ImGui_ImplGlfw_InitForOpenGL(window, true);
    ImGui_ImplOpenGL3_Init("#version 130");

    float xscale = 1.0f, yscale = 1.0f;
    glfwGetWindowContentScale(window, &xscale, &yscale);
    const fs::path dir = executableDir();
    nt::ui::loadFonts(findAssets(dir), xscale > 0 ? xscale : 1.0f);

    // Kurser och verktyg
    std::vector<nt::Course> courses;
    std::string error;
    fs::path content = nt::findContentDir(dir);
    if (content.empty()) content = nt::findContentDir(fs::current_path());
    try {
        if (content.empty()) throw std::runtime_error("Hittade ingen content/-mapp bredvid programmet.");
        courses = nt::loadCourses(content);
    } catch (const std::exception& e) {
        error = e.what();
    }
    nt::ui::App app(std::move(courses), nt::Toolchain::detect(dir), error);
    if (const char* route = std::getenv("NOLLTERM_ROUTE")) app.openRoute(route);
    if (const char* scroll = std::getenv("NOLLTERM_SCROLL")) app.debugScroll = (float)std::atof(scroll);

    // Skärmdump för README och tester: NOLLTERM_SHOT=fil.ppm sparar en bild efter några bildrutor.
    const char* shot = std::getenv("NOLLTERM_SHOT");
    int frameCount = 0;

    while (!glfwWindowShouldClose(window)) {
        // Vänta på händelser när inget händer, så att appen inte drar ström i onödan.
        // Kort timeout så att timern i provläget och bakgrundsjobb ändå uppdateras.
        glfwWaitEventsTimeout(0.25);

        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();
        app.frame();
        ImGui::Render();

        int w, h;
        glfwGetFramebufferSize(window, &w, &h);
        glViewport(0, 0, w, h);
        ImVec4 bg = nt::ui::toVec4(nt::ui::pal().paper);
        glClearColor(bg.x, bg.y, bg.z, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
        glfwSwapBuffers(window);

        const int shotFrame = std::getenv("NOLLTERM_SHOT_FRAME") ? std::atoi(std::getenv("NOLLTERM_SHOT_FRAME")) : 6;
        if (shot && ++frameCount == shotFrame) {
            std::vector<unsigned char> px((size_t)w * h * 3);
            glPixelStorei(GL_PACK_ALIGNMENT, 1);
            glReadPixels(0, 0, w, h, GL_RGB, GL_UNSIGNED_BYTE, px.data());
            if (FILE* f = std::fopen(shot, "wb")) {
                std::fprintf(f, "P6\n%d %d\n255\n", w, h);
                for (int y = h - 1; y >= 0; y--) std::fwrite(&px[(size_t)y * w * 3], 1, (size_t)w * 3, f);
                std::fclose(f);
            }
            break;
        }
    }

    app.progress().saveIfDirty();
    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplGlfw_Shutdown();
    ImGui::DestroyContext();
    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}
