import BasePage from "./BasePage";
import * as fs from "fs";
import * as path from "path";
import test, { expect,TestInfo } from "@playwright/test";
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
    private readonly communityPayScalesLocator = ".tree:has-text('Pay Scales')";
    private readonly nameInputLocator = "div:has-text('Name:') + div input";
    private readonly descrInputLocator = "div:has-text('Description:') + div input";
    private readonly _fileUploadInputLocator = "#fileUpload";
    public get fileUploadInputLocator() {
        return this._fileUploadInputLocator;
    }
    
    // private readonly commyunityPayScalesLinkLocator = "[href='/admin/payscales']";
    //Actions
    async clickAddNewPayScaleBtn(): Promise<void> {      
        await this.clickButtonUsingRole(this.addNewPayScaleBtnText);       
    }
    async clickPayScalesLink(): Promise<void> {
        await this.click(this.communityPayScalesLocator);
    }
    async fillNameInput(name: string): Promise<void> {
        await this.fill(this.nameInputLocator, name);
    }
    
    async fillDescrInput(descr: string): Promise<void> {
        await this.fill(this.descrInputLocator, descr);
    }
   
    
}