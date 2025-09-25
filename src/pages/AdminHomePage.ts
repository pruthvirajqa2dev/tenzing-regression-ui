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
export default class AdminHomePage extends BasePage {
    //Locators
    private readonly emailAddressInputLocator = "[typeof='email']";
    private readonly passwordInputLocator = "[type='password']";
    private readonly loginBtnLocator = "[type='submit']]";

    //Actions
   
}