// ==UserScript==
// @name         Google Results Cleanup
// @namespace    http://tampermonkey.net/
// @version      2026-09-21
// @description  try to take over the world!
// @author       bellydrum
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// ==/UserScript==

function isMobile() {
    return navigator.userAgentData.mobile;
}

function retrieveElementsBasedOnTargetText(elementName, targetText) {
    const elements = Array.from(document.querySelectorAll(elementName));
    let results = elements.filter(element => element.textContent.trim() === targetText);

    if (results.length == 0) {
        results = elements.filter(element => element.textContent.includes(targetText));
    }

    return results;
}

function AIOverviewExists() {
    return document.querySelector("[data-cb-scope]");
}

function sponsoredResultsExists() {
    return document.querySelector("[aria-label='Ads']");
}

function AIModeNavbarButtonExists() {
    const matchingSpans = retrieveElementsBasedOnTargetText("span", "AI Mode")
    if (matchingSpans.length) {
        const matchingSpan = matchingSpans.at(0);
        return matchingSpan.closest("div[role='listitem']");
    }
}

function AIModeSearchBarButtonExists() {
    const matchingSpans = retrieveElementsBasedOnTargetText("span", "AI Mode");
    for (const matchingSpan of matchingSpans) {
        const parentSearchBar = matchingSpan.closest("form[action='/search']");
        if (parentSearchBar) {
            return matchingSpan.closest("button");
        }
    }
}

function linkToAIModeInSearchResultsExists() {
    const elementsThatLinkToAIMode = document.querySelectorAll("a[href='https://google.com/aimode']")
    for (const link of elementsThatLinkToAIMode) {
        const linkParent = link.closest("[jscontroller]");
        const linkParentH2Child = linkParent.querySelector("h2");

        if (linkParentH2Child) {
            return linkParent;
        }
    }
    return false
}

function linkToGoogleAIExists() {
    const googleAIDomains = [
        "google.com/ai",
        "google.com/aimode",
        "gemini.google.com",
    ]

    for (const domain of googleAIDomains) {
        const result = document.querySelector(`a[href*='https://${domain}']`)
        if (result) {
            return result
        }
    }

    return false
}


(function() {
    'use strict';

    let observerFailsafe = false;

    setTimeout(() => {
        observerFailsafe = true;
    }, 2000);

    const AIOverviewObserver = new MutationObserver((mutations, me) => {
        const target = AIOverviewExists();

        if (target) {
            target.remove();
            me.disconnect();
        } else if (observerFailsafe) me.disconnect()
    });

    const AIModeNavbarButtonObserver = new MutationObserver((mutations, me) => {
        const target = AIModeNavbarButtonExists();

        if (target) {
            console.log(Object.getPrototypeOf(target));
            target.remove();
            me.disconnect();
        } else if (observerFailsafe) me.disconnect()
    });

    const AIModeSearchBarButtonObserver = new MutationObserver((mutations, me) => {
        const target = AIModeSearchBarButtonExists();

        if (target) {
            target.remove();
            me.disconnect();
        } else if (observerFailsafe) me.disconnect()
    });

    const linksToAIModeInSearchResultsObserver = new MutationObserver((mutations, me) => {
        const target = linkToAIModeInSearchResultsExists();

        if (target) target.remove()
        if (observerFailsafe) me.disconnect()
    });

    const linksToGoogleAIObserver = new MutationObserver((mutations, me) => {
        const target = linkToGoogleAIExists();

        if (target) target.setAttribute("href", "https://google.com")
        if (observerFailsafe) me.disconnect()
    });

    const sponsoredResultsObserver = new MutationObserver((mutations, me) => {
        const target = sponsoredResultsExists();

        if (target) {
            target.remove();
            me.disconnect();
        } else if (observerFailsafe) me.disconnect()
    });


    try {
        AIOverviewObserver.observe(document.body, {childList: true, subtree: true});
    } catch(exception) {
        console.log(exception)
    }

    try {
        AIModeNavbarButtonObserver.observe(document.body, {childList: true, subtree: true});
    } catch (exception) {
        console.log(exception)
    }

    try {
        AIModeSearchBarButtonObserver.observe(document.body, {childList: true, subtree: true});
    } catch (exception) {
        console.log(exception)
    }

    try {
        linksToAIModeInSearchResultsObserver.observe(document.body, {childList: true, subtree: true});
    } catch (exception) {
        console.log(exception)
    }

    try {
        linksToGoogleAIObserver.observe(document.body, {childList: true, subtree: true});
    } catch (exception) {
        console.log(exception)
    }

    try {
        sponsoredResultsObserver.observe(document.body, {childList: true, subtree: true});
    } catch (exception) {
        console.log(exception)
    }

    if (isMobile()) {
        addEventListener("DOMContentLoaded", (event) => {
            // remove AI Mode Navbar button
            const AIModeNavbarButton = AIModeNavbarButtonExists();
            AIModeNavbarButton.remove();
        });
    }

})();
