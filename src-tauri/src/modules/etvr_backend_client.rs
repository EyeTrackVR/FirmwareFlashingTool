
#[tauri::command(async)]
pub async fn shutdown_etvr_backend(app_handle: tauri::AppHandle) -> Result<(), String>{
    // requesting shutdown will immediately kill the backend so we can safely ignore the result here
    let _ = reqwest::get("http://127.0.0.1:8000/etvr/shutdown").await;
    println!("ETVR Backend shutdown successfully");

    app_handle.exit(0);
    Ok(())
}