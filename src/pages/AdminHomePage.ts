import BasePage from "./BasePage";
import * as fs from "fs";
import * as path from "path";
import test, { expect,TestInfo } from "@playwright/test";
import LoginPage from "./LoginPage";
import CommunityPage from "./CommunityPage";
/**
 * @author: @pruthvirajqa2dev
 * Tenzing Admin page class with locators
 */
/**
 * Represents the login page of the application.
 * Extends the BasePage class to inherit common page functionalities.
 */
export default class AdminHomePage extends BasePage {
    //Locators
   
    private readonly signOutBtnLocator = ".nodetext:has-text('Sign out')";
    private readonly communityFirstColumnLocator = "[href='/admin/payscales']";
    
    //Actions
    /**
     * 
     * @param testInfo 
     * @returns 
     */
   async logout(testInfo: TestInfo): Promise<LoginPage> {      
        const loginPage: LoginPage = await this.clickSignOutBtn(testInfo);
        return loginPage;
   }
   /**
    * 
    * @param testInfo - Test information object
    * @returns 
    */
   async clickSignOutBtn(testInfo: TestInfo): Promise<LoginPage> {
        await this.page.locator(this.signOutBtnLocator).click();
        const loginPage = new LoginPage(this.page,testInfo);
        return loginPage;
    }

    async navigateToCommunityPage(testInfo: TestInfo): Promise<CommunityPage> {
        await this.click(this.communityFirstColumnLocator)
        const communityPage = new CommunityPage(this.page,testInfo);
        return communityPage;
    }
    
}