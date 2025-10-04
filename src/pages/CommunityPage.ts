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
    
    // private readonly commyunityPayScalesLinkLocator = "[href='/admin/payscales']";
    //Actions
    async clickAddNewPayScaleBtn(): Promise<void> {      
        await this.page.getByRole('button', { name: this.addNewPayScaleBtnText }).click();       
    }
   
    
}