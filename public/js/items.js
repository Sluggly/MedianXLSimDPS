var offhandList = ["Buckler" ,"Small Shield","Large Shield","Kite Shield","Tower Shield","Gothic Shield","Bone Shield","Spiked Shield","Athulua's Hand","Phoenix Shield","Setzschild","Parma","Aspis","Totem Shield","Bladed Shield","Bull Shield","Bronze Shield","Gilded Shield","Preserved Head","Zombie Head","Unraveller Head","Gargoyle Head","Demon Head","Targe","Rondache","Heraldic Shield","Aerin Shield","Crown Shield","Arrow Quiver","Quiver"];

function isTypeOffhand(type) {
    for (const item of offhandList) {
        if (item === type || "Superior " + item === type) { return true; }
    }
    return false;
}