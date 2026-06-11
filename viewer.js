const API_URL =
    "https://djhilha.github.io/vh-companion-live-data/companions.json";

const ASSETS = {
    heartFull: "assets/hearts/heart_full.png",
    heartEmpty: "assets/hearts/heart_empty.png",
    temporalDefault: "assets/temporals/default.png",
    relicDefault: "assets/relics/default.png"
};

const RELIC_ICON_MAP = {
    companion_challenge: "companion_challenge",
    extended: "extended",

    gilded_cascade: "gilded_cascade",
    living_cascade: "living_cascade",
    ornate_cascade: "ornate_cascade",
    coin_cascade: "coin_cascade",
    wooden_cascade: "wooden_cascade",

    gilded: "gilded",
    living: "living",
    ornate: "ornate",
    wooden_bonus: "wooden_bonus",

    coin_pile: "coin_pile",
    phoenix: "phoenix",
    plentiful: "plentiful",
    xp_gain: "xp_gain",
    pandoras_box: "pandoras_box"
};

const XP_TABLE = [
    0,
    10000,
    25000,
    50000,
    125000,
    250000,
    500000,
    666666,
    1333332,
    1999998,
    2666664,
    3333330,
    3999996,
    4666662,
    5333328,
    5999994,
    6666660,
    7333326,
    7999992,
    8666658,
    9333324,
    9999990,
    10666656,
    11333322,
    11999988,
    12666654,
    13333320,
    13999986,
    14666652,
    15333318,
    15999984,
    16666650,
    17333316,
    17999982,
    18666648,
    19333314,
    19999980,
    20666646,
    21333312,
    21999978,
    22666644,
    23333310,
    23999976,
    24666642,
    25333308,
    25999974,
    26666640,
    27333306,
    27999972,
    28666638,
    29333304,
    29999970,
    30666636,
    31333302,
    31999968,
    32666634,
    33333300,
    33999966,
    34666632,
    35333298,
    35999964,
    36666630,
    37333296,
    37999962,
    38666628,
    39333294,
    39999960,
    40666626,
    41333292,
    41999958,
    42666624,
    43333290,
    43999956,
    44666622,
    45333288,
    45999954,
    46666620,
    47333286,
    47999952,
    48666618,
    49333284,
    49999950,
    50666616,
    51333282,
    51999948,
    52666614,
    53333280,
    53999946,
    54666612,
    55333278,
    55999944,
    56666610,
    57333276,
    57999942,
    58666608,
    59333274,
    59999940,
    60666606,
    61333272,
    61999938
];

let companionsCache = [];

const claimBox =
    document.getElementById("claimBox");

const savedView =
    document.getElementById("savedView");

const companionCard =
    document.getElementById("companionCard");

const companionNameInput =
    document.getElementById("companionNameInput");

const saveCompanionButton =
    document.getElementById("saveCompanionButton");

const changeCompanionButton =
    document.getElementById("changeCompanionButton");

const savedCompanionName =
    document.getElementById("savedCompanionName");

const claimMessage =
    document.getElementById("claimMessage");

let selectedCompanionName =
    localStorage.getItem("selectedCompanion");

saveCompanionButton.addEventListener(
    "click",
    () => {

        const enteredName =
            companionNameInput.value.trim();

        if (!enteredName) {
            return;
        }

        const found =
            companionsCache.find(
                c =>
                    c.name.toLowerCase()
                    === enteredName.toLowerCase()
            );

        if (!found) {

            claimMessage.textContent =
                "Companion not found.";

            return;
        }

        localStorage.setItem(
            "selectedCompanion",
            found.name
        );

        selectedCompanionName =
            found.name;

        renderSelectedCompanion();
    }
);

changeCompanionButton.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "selectedCompanion"
        );

        selectedCompanionName = null;

        claimBox.style.display = "block";

        savedView.style.display = "none";

        companionCard.style.display = "none";
    }
);

async function loadData() {

    try {

        const response = await fetch(
            API_URL,
            {
                cache: "no-store"
            }
        );

        const data =
            await response.json();

        companionsCache =
            data.companions || [];

        if (selectedCompanionName) {
            renderSelectedCompanion();
        }

    } catch (err) {

        console.error(
            "Failed loading companion data",
            err
        );
    }
}

function renderSelectedCompanion() {

    const companion =
        companionsCache.find(
            c =>
                c.name.toLowerCase()
                === selectedCompanionName.toLowerCase()
        );

    if (!companion) {

        claimMessage.textContent =
            "Saved companion no longer exists.";

        return;
    }

    claimBox.style.display = "none";

    savedView.style.display = "flex";

    companionCard.style.display = "grid";

    savedCompanionName.textContent =
        companion.name;

    renderCompanion(companion);
}

function renderCompanion(companion) {

    const status =
        getStatus(companion);

    setText("name", companion.name);

    setText(
        "series",
        companion.series || "UNKNOWN"
    );

    setText(
        "xp",
        formatNumber(companion.xp)
    );

    setText(
        "vaultRuns",
        companion.vaultRuns
    );

    setText(
        "type",
        normalizeText(companion.type)
    );

    setText(
        "temporal",
        normalizeText(companion.temporal)
    );

    renderStatus(status);

    renderXPBar(companion);

    renderHearts(companion);

    renderTemporalIcon(companion.temporal);

    renderRelics(
        "relicList",
        companion.relics || []
    );

    renderRelics(
        "ancientRelicList",
        companion.ancientRelics || []
    );

    document.getElementById(
        "playerModel"
    ).src =
        `https://mc-heads.net/body/${
            encodeURIComponent(
                companion.skin || companion.name
            )
        }/220`;
}

function renderStatus(status) {

    const statusEl =
        document.getElementById("status");

    statusEl.textContent = status;

    statusEl.className = "status";

    if (status === "SLEEPING") {
        statusEl.classList.add("sleeping");
    }

    if (status === "RETIRED") {
        statusEl.classList.add("retired");
    }
}

function getStatus(companion) {

    if ((companion.hearts || 0) <= 0) {
        return "RETIRED";
    }

    return companion.status
        || "BATTLE READY";
}

function renderXPBar(companion) {

    const xpFill =
        document.getElementById("xpFill");

    const xpText =
        document.getElementById("xpText");

    const progress =
        getLevelProgress(
            companion.level,
            companion.xp
        );

    xpFill.style.width =
        `${progress}%`;

    xpText.textContent =
        `Level ${companion.level}`;
}

function getLevelProgress(level, xp) {

    if (level >= 100) {
        return 100;
    }

    const nextLevelXP =
        getXPForLevel(level + 1);

    if (nextLevelXP <= 0) {
        return 0;
    }

    return clamp(
        (xp / nextLevelXP) * 100,
        0,
        100
    );
}

function getXPForLevel(level) {

    if (level <= 1) {
        return 0;
    }

    const index = level - 1;

    if (index >= XP_TABLE.length) {

        return XP_TABLE[
            XP_TABLE.length - 1
        ];
    }

    return XP_TABLE[index];
}

function renderHearts(companion) {

    const heartRow =
        document.getElementById("heartRow");

    heartRow.innerHTML = "";

    const currentHearts =
        Math.max(
            0,
            companion.hearts || 0
        );

    const maxHearts =
        maxHeartsFromLevel(
            companion.level
        );

    for (let i = 0; i < maxHearts; i++) {

        const img =
            document.createElement("img");

        img.className = "heart";

        img.src =
            i < currentHearts
                ? ASSETS.heartFull
                : ASSETS.heartEmpty;

        heartRow.appendChild(img);
    }
}

function maxHeartsFromLevel(level) {

    if (level >= 10) return 5;
    if (level >= 8) return 4;
    if (level >= 5) return 3;
    if (level >= 4) return 2;

    return 1;
}

function renderTemporalIcon(temporal) {

    const icon =
        document.getElementById("temporalIcon");

    const clean =
        cleanId(temporal);

    icon.src =
        `assets/temporals/${clean}.png`;

    icon.onerror = () => {

        icon.src =
            ASSETS.temporalDefault;
    };
}

function renderRelics(containerId, relics) {

    const container =
        document.getElementById(containerId);

    container.innerHTML = "";

    if (!relics || relics.length === 0) {

        container.innerHTML =
            `<div class="empty">No relics equipped</div>`;

        return;
    }

    const stackedModifiers = {};

    relics.forEach(relic => {

        (relic.modifiers || []).forEach(
            modifier => {

                const clean =
                    cleanId(modifier);

                if (!stackedModifiers[clean]) {
                    stackedModifiers[clean] = 0;
                }

                stackedModifiers[clean]++;
            }
        );
    });

    Object.entries(stackedModifiers)
        .forEach(([modifier, count]) => {

            const iconName =
                RELIC_ICON_MAP[modifier]
                || "default";

            const iconPath =
                `assets/relics/${iconName}.png`;

            const item =
                document.createElement("div");

            item.className =
                "stacked-relic";

            item.innerHTML = `
                <div class="stacked-icon-wrap">

                    <img
                        src="${iconPath}"
                        onerror="this.src='${ASSETS.relicDefault}'"
                    >

                    ${
                        count > 1
                            ? `
                                <span class="stack-count">
                                    x${count}
                                </span>
                              `
                            : ""
                    }

                </div>

                <div class="stacked-name">
                    ${normalizeText(modifier)}
                </div>
            `;

            container.appendChild(item);
        });
}

function setText(id, value) {

    document.getElementById(id)
        .textContent = value ?? "-";
}

function cleanId(value) {

    return String(value || "")
        .replace("the_vault:", "")
        .toLowerCase()
        .trim();
}

function normalizeText(value) {

    const clean =
        String(value || "-")
            .replace("the_vault:", "")
            .toLowerCase()
            .trim();

    const DISPLAY_NAME_MAP = {

        kill_hunter: "Hunterino",
        kill_totem: "Totemic",
        kill_frostnova: "Nova Explosion",
        kill_charm: "Charming",
        bronze_nuke: "Coin Explosion",

        living_cascade: "Living",
        ornate_cascade: "Ornate",
        gilded_cascade: "Gilded",
        wooden_cascade: "Wooden",

        coin_pile: "Wealthy",
        coin_cascade: "Wealthy",

        ornate: "Bonus Ornate",
        gilded: "Bonus Gilded",
        living: "Bonus Living",

        xp_gain: "Accustomed"
    };

    if (DISPLAY_NAME_MAP[clean]) {
        return DISPLAY_NAME_MAP[clean];
    }

    return clean
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            char => char.toUpperCase()
        );
}

function formatNumber(value) {

    return Number(value || 0)
        .toLocaleString();
}

function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );
}

loadData();

setInterval(loadData, 10000);