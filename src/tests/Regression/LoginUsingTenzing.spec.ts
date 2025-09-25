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
test.describe("Login and Logout " + `${process.env.test_env}`.toUpperCase(), () => {
    //Test case 1
    test("Login and Logout  ", async ({ page }, testInfo) => {
       
        //Login
        const loginPage = new LoginPage(page, testInfo);
        await loginPage.navigateTo("/");
        await expect(page).toHaveTitle(expectedTexts.defaultPageTitle);

          //Login
            const homepage = await test.step(
                `Login using Tenzing Email` ,
                async () => {
                    return await login(page, testInfo);
                }
            );
        await expect(page).toHaveTitle(expectedTexts.adminLoginPageTitle);
        
        
        });
});