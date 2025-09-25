import AdminHomePage from "./AdminHomePage";
import BasePage from "./BasePage";
import * as fs from "fs";
import * as path from "path";
import { TestInfo } from "@playwright/test";
/**
 * @author: @pruthvirajqa2dev
 * SIMS Finance Login page class with locators
 */
/**
 * Represents the login page of the application.
 * Extends the BasePage class to inherit common page functionalities.
 */
export default class LoginPage extends BasePage {
    //Locators
    private readonly emailAddressInputLocator = "[typeof='email']";
    private readonly passwordInputLocator = "[type='password']";
    private readonly loginBtnLocator = "[type='submit']";

    //Actions
    /**
     * Fills in the username and password fields on the login page.
     *
     * @param emailAddress - The username to be entered.
     * @param password - The password to be entered.
     */
    async fillEmailAddressAndPassword(emailAddress: string, password: string) {
        await this.page.locator(this.emailAddressInputLocator).fill(emailAddress);
        await this.page.locator(this.passwordInputLocator).fill(password);
    }

    /**
     * Logs in to the application using the provided username and password.
     * Takes a screenshot of the login page and saves it to the specified path.
     *
     * @param username - The username to be used for login.
     * @param password - The password to be used for login.
     * @param testInfo - Information about the current test, used for logging and screenshot paths.
     * @returns A promise that resolves to an instance of the HomePage class.
     */
    async login(
        [emailAddress, password]: [string, string],
        testInfo: TestInfo
    ): Promise<AdminHomePage> {
        await this.navigateTo("/");
        await this.fillEmailAddressAndPassword(emailAddress, password);
        const homepage: AdminHomePage = await this.clickLoginBtn(testInfo);
        return homepage;
    }

    /**
     * Clicks the login button on the login page.
     * Handles any errors that occur during the click action.
     *
     * @param testInfo - Information about the current test, used for logging and navigation.
     * @returns A promise that resolves to an instance of the HomePage class.
     */
    async clickLoginBtn(testInfo: any): Promise<AdminHomePage> {
        await this.page
            .locator(this.loginBtnLocator)
            .click()
            .catch((error) => {
                console.error(`Error clicking login button: ${error}`);
                throw error;
            });

        const homePage = new AdminHomePage(this.page, testInfo);
        return homePage;
    }
}