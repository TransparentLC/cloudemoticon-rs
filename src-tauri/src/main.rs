// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // snap - Apps using Webkit, like Foliate, Wike, Caveliar or GNOME Web do not show content Ubuntu 22.04 with NVIDIA graphics - Ask Ubuntu
    // https://askubuntu.com/questions/1493204#answer-1493214
    if cfg!(target_os = "linux") {
        unsafe {
            std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        }
    }
    cloudemoticon_rs_lib::run()
}
