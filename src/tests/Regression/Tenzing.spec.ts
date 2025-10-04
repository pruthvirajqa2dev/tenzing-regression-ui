import test, { expect, Page, TestInfo } from "@playwright/test";
import LoginPage from "../../pages/LoginPage";
import ENV from "../../config/env";
import expectedTexts from "../../data/expectedTexts.json";
import { getCredentials } from "../../utils/credentials";
import AdminHomePage from "../../pages/AdminHomePage";

const tenzing_email: string = ENV.TENZING_EMAIL ?? "";

async function login(page: Page, testInfo: TestInfo) {
    const loginPage = new LoginPage(page, testInfo);
    const homepage: AdminHomePage = await loginPage.login(
        getCredentials(tenzing_email),
        testInfo
    );
    
    return homepage;
}
test.describe("Regression " + `${process.env.test_env}`.toUpperCase(), () => {
    //Test case 1
    test("Login and Logout  ", async ({ page }, testInfo) => {
       
        //Login
        var loginPage = new LoginPage(page, testInfo);
        await loginPage.navigateTo("/");
        await expect(page).toHaveTitle(expectedTexts.defaultPageTitle);        
        await loginPage.expectPageElementsVisibilityOnLoad();
        //Login
        const homepage = await test.step(
            `Login using Tenzing Email` ,
                async () => {
                    return await login(page, testInfo);
                }
            );
        await expect(page).toHaveTitle(expectedTexts.adminLoginPageTitle);
        //Logout
        // await homepage.clickButtonUsingRole("☰");
        loginPage = await test.step(
                `Logout from Application` ,
                async () => {
                    return await homepage.clickSignOutBtn(testInfo);;
                }
            );
        await loginPage.expectPageElementsVisibilityOnLoad();        
        });
    test("Community - Add Pay Scales ", async ({ page }, testInfo) => {    
        //Login
        var loginPage = new LoginPage(page, testInfo);
        await loginPage.navigateTo("/");
        await expect(page).toHaveTitle(expectedTexts.defaultPageTitle);        
        await loginPage.expectPageElementsVisibilityOnLoad();
        //Login
        const homepage = await test.step(
            `Login using Tenzing Email` ,
                async () => {
                    return await login(page, testInfo);
                }
            );
        await expect(page).toHaveTitle(expectedTexts.adminLoginPageTitle);
        
        const communityPage = await test.step(
            `Navigate to Commyunity - Pay Scales` ,
                async () => {
                    return await homepage.navigateToCommunityPage(testInfo);
                }
            );   
        await communityPage.clickAddNewPayScaleBtn();
        await communityPage.verifyDialogHeaderText(
            expectedTexts.addPayScalesDialogHeader);
        
        await communityPage.verifyDialogStartText(
            expectedTexts.mountainBgTextForAddPayScalesDialogPart1,
            expectedTexts.mountainBgTextForAddPayScalesDialogPart2);
        //Todo : Enter Name and description
        //Todo : Enter Logo
        //Todo: Click Next
        //Todo: Upload Excel Template
        await communityPage.clickDialogCloseBtn();
    });
});