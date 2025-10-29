import BasePage from "./BasePage";
import * as fs from "fs";
import * as path from "path";
import test, { expect, TestInfo } from "@playwright/test";
import LoginPage from "./LoginPage";
/**
 * @author: @pruthvirajqa2dev
 * Tenzing Community page class with locators
 */
/**
 * Represents the login page of the application.
 * Extends the BasePage class to inherit common page functionalities.
 */
export default class CommunityPage extends BasePage {
    //Locators
    private readonly addNewPayScaleBtnText = "Add New Pay Scale";
    private readonly addNewGradeBtnText = "Add New Grading Structure";
    private readonly addJobRoleBtnText = "Add New Job Role";
    private readonly addManuallyBtnText = "Add Manually";
    private readonly communityPayScalesLocator = ".tree:has-text('Pay Scales')";
    private readonly communityGradesLocator = ".tree:has-text('Grades')";
    private readonly communityJobRolesLocator = ".tree:has-text('Job Roles')";
    private readonly nameInputLocator = "div:has-text('Name:') + div input";
    private readonly jobRoleNameInputLocator =
        "div:has-text('Job Role Name:') + div input";
    private readonly wfcPostDropdownLocator =
        "div:has-text('WFC Post:') + div input.e-dropdownlist";
    private readonly wfcPostDropdownListLocator =
        "div.e-dropdownbase + .e-list-item:has-text('%TEXT%')";
    private readonly wfcRoleDropdownListLocator =
        "div.e-dropdownbase + .e-list-item:has-text('%TEXT%')";
    // div.e-dropdownbase
    private readonly wfcRoleDropdownLocator =
        "div:has-text('WFC Role:') + div input.e-dropdownlist";
    // e-dropdownlist
    private readonly descrInputLocator =
        "div:has-text('Description:') + div input";
    private readonly _fileUploadInputLocator = "#fileUpload";
    private readonly _cardHeaderTitleLocator =
        ".e-card-header-title:has-text('%TEXT%')";
    public getCardHeaderTitleLocator(title: string) {
        return this._cardHeaderTitleLocator.replace("%TEXT%", title);
    }
    private readonly _cardContentLocator = ".e-card-content:has-text('%TEXT%')";
    public getCardContentLocator(content: string) {
        return this._cardContentLocator.replace("%TEXT%", content);
    }
    public get fileUploadInputLocator() {
        return this._fileUploadInputLocator;
    }
    private readonly uploadedTableRowLeftLocator =
        "td[role='gridcell'][aria-colindex='1']";
    private readonly uploadedTableRowRightLocator =
        "td.e-rowcell[aria-colindex='2']";

    private readonly _cardLocator = ".e-card";
    public get cardLocator() {
        return this._cardLocator;
    }
    private readonly _viewBtnLocator = ".bi-file-text-fill";
    public get viewBtnLocator() {
        return this._viewBtnLocator;
    }
    private readonly _deleteBtnLocator = ".bi-trash-fill";
    public get deleteBtnLocator() {
        return this._deleteBtnLocator;
    }
    private readonly _archiveBtnLocator = ".bi-eye-slash-fill";
    public get archiveBtnLocator() {
        return this._archiveBtnLocator;
    }
    private readonly _downloadBtnLocator = ".bi-download";
    public get downloadBtnLocator() {
        return this._downloadBtnLocator;
    }
    private readonly _unarchiveBtnLocator = ".bi-eye-fill";
    public get unarchiveBtnLocator() {
        return this._unarchiveBtnLocator;
    }
    private readonly _dateLabelLocator = ".date-badge";
    public get dateLabelLocator() {
        return this._dateLabelLocator;
    }
    //date-badge
    private readonly _dialogLocator = ".e-dialog";
    public get dialogLocator() {
        return this._dialogLocator;
    }

    private readonly _primaryBtnLocator = ".e-primary";
    public get primaryBtnLocator() {
        return this._primaryBtnLocator;
    }

    private readonly showHiddenToggleLocator =
        "label:has-text('Show Hidden') + .e-switch-wrapper input[type='checkbox']";

    private readonly _dialogDeleteButtonLocator = ".bg-danger";
    public get dialogDeleteButtonLocator() {
        return this._dialogDeleteButtonLocator;
    }
    private readonly _btnLocator = ".e-flat";
    public get btnLocator() {
        return this._btnLocator;
    }
    //Actions
    async clickAddNewPayScaleBtn(): Promise<void> {
        await this.clickButtonUsingRole(this.addNewPayScaleBtnText);
    }
    async clickAddNewGradeBtn(): Promise<void> {
        await this.clickButtonUsingRole(this.addNewGradeBtnText);
    }
    async clickAddNewJobRoleBtn(): Promise<void> {
        await this.clickButtonUsingRole(this.addJobRoleBtnText);
    }
    async clickPayScalesLink(): Promise<void> {
        await this.click(this.communityPayScalesLocator);
    }
    async clickGradesLink(): Promise<void> {
        await this.click(this.communityGradesLocator);
    }
    async clickJobRolesLink(): Promise<void> {
        await this.click(this.communityJobRolesLocator);
    }
    async fillNameInput(name: string): Promise<void> {
        await this.fill(this.nameInputLocator, name);
    }

    async fillDescrInput(descr: string): Promise<void> {
        await this.fill(this.descrInputLocator, descr);
    }
    async fillJobRoleNameInput(name: string): Promise<void> {
        await this.fill(this.jobRoleNameInputLocator, name);
    }
    async clickWFCPost(): Promise<void> {
        await this.click(this.wfcPostDropdownLocator);
    }
    async selectWFCPost(post: string): Promise<void> {
        await this.click(
            this.wfcPostDropdownListLocator.replace("%TEXT%", post)
        );
    }
    async clickWFCRole(): Promise<void> {
        await this.click(this.wfcPostDropdownLocator);
    }
    async selectWFCRole(role: string): Promise<void> {
        await this.click(
            this.wfcRoleDropdownListLocator.replace("%TEXT%", role)
        );
    }
    /**
     * Logs all values from the left column of the uploaded table.
     */
    async logAllLeftColumnValues(): Promise<string[]> {
        // const leftColumnValues = await
        // this.page.locator(this.uploadedTableRowLeftLocator).allTextContents();
        // console.log("Left Column Values:"+ leftColumnValues);}
        await this.page.waitForTimeout(4000);
        await this.page.waitForLoadState("load");
        const locators = await this.page
            .locator(this.uploadedTableRowLeftLocator)
            .all();
        const count = locators.length;
        console.log(`Total rows in left column: ${count}`);
        const grid = this.page.locator(".e-gridcontent").nth(1); // Use the grid's main container selector
        let allPoints: string[] = [];
        let previousVisiblePoints: string[] = [];

        while (true) {
            // Extract currently visible points
            const visiblePoints = await this.page
                .locator("td[role='gridcell'][aria-colindex='1']")
                .allTextContents();

            // Add unique new points
            for (const pt of visiblePoints) {
                if (!allPoints.includes(pt)) {
                    allPoints.push(pt);
                }
            }

            // If scrolling does not load more items, break loop
            if (
                visiblePoints.length === previousVisiblePoints.length &&
                visiblePoints.every(
                    (pt, idx) => pt === previousVisiblePoints[idx]
                )
            ) {
                break;
            }

            previousVisiblePoints = visiblePoints;

            // Scroll down the grid container to load more rows
            await grid.evaluate((el) => (el.scrollTop += el.clientHeight));
            await this.page.waitForTimeout(500); // Wait for Blazor to render more rows
        }

        console.log("all left points:" + allPoints); // Should include all unique points, even if grid is virtualized
        //Returning all points for further verification if needed
        return allPoints;
        // const count = await leftColumnValues.count();
        // console.log("Left Column Values:" +count); }
    }
    /**
     *
     */
    async logAllRightColumnValues(): Promise<string[]> {
        await this.page.waitForTimeout(4000);
        await this.page.waitForLoadState("load");
        const locators = await this.page
            .locator(this.uploadedTableRowRightLocator)
            .all();
        const count = locators.length;
        console.log(`Total rows in left column: ${count}`);
        const grid = this.page.locator(".e-gridcontent").nth(1); // Use the grid's main container selector
        let allPoints: string[] = [];
        let previousVisiblePoints: string[] = [];

        while (true) {
            // Extract currently visible points
            const visiblePoints = await this.page
                .locator(this.uploadedTableRowRightLocator)
                .allTextContents();

            // Add unique new points
            for (const pt of visiblePoints) {
                if (!allPoints.includes(pt)) {
                    allPoints.push(pt);
                }
            }

            // If scrolling does not load more items, break loop
            if (
                visiblePoints.length === previousVisiblePoints.length &&
                visiblePoints.every(
                    (pt, idx) => pt === previousVisiblePoints[idx]
                )
            ) {
                break;
            }

            previousVisiblePoints = visiblePoints;

            // Scroll down the grid container to load more rows
            await grid.evaluate((el) => (el.scrollTop += el.clientHeight));
            await this.page.waitForTimeout(500); // Wait for Blazor to render more rows
        }

        console.log("all right points:" + allPoints); // Should include all unique points, even if grid is virtualized
        return allPoints;
        // const count = await leftColumnValues.count();
        // console.log("Left Column Values:" +count); }
    }
    async toggleShowHidden(): Promise<void> {
        await this.page.locator(this.showHiddenToggleLocator).click();
    }
    async clickAddManuallyJobRoles(): Promise<void> {
        await this.clickButtonUsingRole(this.addManuallyBtnText);
    }
}
