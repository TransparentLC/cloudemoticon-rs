use enigo::{Enigo, Key, Keyboard, Settings};
use tauri::{
    Manager,
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
};

#[tauri::command]
fn input_text(app: tauri::AppHandle, mode: &str, text: &str) {
    use tauri_plugin_clipboard_manager::ClipboardExt;

    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    match mode {
        "auto-input" => {
            enigo.text(text).unwrap();
        }
        "copy-paste" => {
            app.clipboard().write_text(text).unwrap();
            enigo.key(Key::Control, enigo::Direction::Press).unwrap();
            enigo
                .key(Key::Unicode('v'), enigo::Direction::Click)
                .unwrap();
            enigo.key(Key::Control, enigo::Direction::Release).unwrap();
        }
        _ => panic!("Invalid input_text mode {mode}"),
    }
}

#[tauri::command]
fn show_selector(app: tauri::AppHandle) {
    let window = app.get_webview_window("selector").unwrap();
    if window.is_visible().unwrap() {
        window.hide().unwrap();
    } else {
        window.center().unwrap();
        window.show().unwrap();
        window.unminimize().unwrap();
        window.set_focus().unwrap();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let window = app.get_webview_window("main").unwrap();
            window.show().unwrap();
            window.set_focus().unwrap();
        }))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            let show_i = MenuItem::with_id(app, "show", "打开主界面", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;
            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .show_menu_on_left_click(true)
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        app.get_webview_window("main").unwrap().show().unwrap();
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => panic!("menu item {:?} not handled", event.id),
                })
                .build(app)?;

            tauri::async_runtime::spawn(async move {
                let mut notification = notify_rust::Notification::new();
                notification.summary("云颜文字");
                notification.body("云颜文字已在运行，可以通过托盘图标打开主界面～(*'ω'*)");
                notification.auto_icon();
                notification.show().unwrap();
            });

            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                window.hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![input_text, show_selector])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_, _| {});
}
