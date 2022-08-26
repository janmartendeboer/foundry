async function hasBackgroundProcessesRunning() {
    return false;
}

const userInterfaceActions = {
    showAbout,
    quit
};

async function forwardUserInterfaceEvent(event) {
    const action = userInterfaceActions[event.detail.id] || (event => {
        Neutralino.os.showMessageBox(
            'Missing handler!',
            `No handler for action ${event.detail.id}.`
        );
    });

    action(event);
}

async function showAbout() {
    await Neutralino.os.showMessageBox(
        'About Foundry',
        `Version: v${NL_APPVERSION}`
    );
}

async function quit() {
    const mayClose = !await hasBackgroundProcessesRunning()
        || await Neutralino.os.showMessageBox(
            'Confirm',
            'Are you sure you want to quit?',
            'YES_NO',
            'QUESTION'
        ) === 'YES';

    if (mayClose) {
        await Neutralino.app.exit(0);
    }
}

Neutralino.init();

Neutralino.events.on('trayMenuItemClicked', forwardUserInterfaceEvent);
Neutralino.events.on('windowClose', quit);

// noinspection JSIgnoredPromiseFromCall
Neutralino.os.setTray(
    {
        icon: '/resources/icons/trayIcon.png',
        menuItems: [
            {id: 'showAbout', text: 'About'},
            {text: '-'},
            {id: 'quit', text: 'Quit'}
        ]
    }
);
