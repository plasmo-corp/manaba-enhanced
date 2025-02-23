"use strict"

import type { StorageSync } from "./types/storage"
import { getStorage, setStorage } from "./network/storage"

import "./style/options.sass"

window.onload = () => {
  const query = new URLSearchParams(window.location.search)
  const queryEvent = query.get("event")

  const versionNum = chrome.runtime.getManifest().version

  if (queryEvent && ["install", "update"].includes(queryEvent)) {
    const noticeDom = document.getElementById("notice")
    if (noticeDom && noticeDom.parentElement) {
      noticeDom.parentElement.style.display = "block"

      switch (queryEvent) {
        case "install":
          noticeDom.innerText = `Thanks for installing manaba Enhanced version ${versionNum}`
          break
        case "update":
          noticeDom.innerText = `manaba Enhanced is updated for version ${versionNum}`
          break
      }
    }
  }

  const versionNumDom = document.getElementById("version-number")
  if (versionNumDom) versionNumDom.innerText = versionNum

  const linkToShortcutsSettings = document.getElementById(
    "link-to-shortcuts-settings"
  )
  if (linkToShortcutsSettings) {
    linkToShortcutsSettings.onclick = (e) => {
      e.preventDefault()
      chrome.tabs.create({ url: "chrome://extensions/shortcuts" })
      return false
    }
  }

  ;(
    Array.from(
      document.getElementsByClassName("checkbox-features")
    ) as HTMLInputElement[]
  ).map((dom) => {
    const key = dom.id as keyof Pick<
      StorageSync,
      | "features-assignments-coloring"
      | "features-autosave-reports"
      | "features-deadline-highlighting"
      | "features-remove-confirmation"
      | "features-filter-courses"
      | "featuresDragAndDrop"
    >

    getStorage({
      kind: "sync",
      keys: key,
      callback: (storage) => {
        const value = storage[key]
        if (typeof value === "boolean") dom.checked = value
      },
    })

    dom.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement
      setStorage({
        kind: "sync",
        items: {
          [key]: target.checked,
          ...(key === "features-assignments-coloring" && {
            featuresAssignmentsColoring: target.checked,
          }),
          ...(key === "features-autosave-reports" && {
            featuresAutoSaveReports: target.checked,
          }),
          ...(key === "features-deadline-highlighting" && {
            featuresDeadlineHighlighting: target.checked,
          }),
          ...(key === "features-remove-confirmation" && {
            featuresRemoveConfirmation: target.checked,
          }),
          ...(key === "features-filter-courses" && {
            featuresFilterCourses: target.checked,
          }),
        },
      })
    })
  })
}
