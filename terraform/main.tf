provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "seven-stones-rg"
  location = "East US"
}

resource "azurerm_service_plan" "plan" {
  name                = "seven-stones-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "app" {
  name                = "seven-stones-game-app"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    application_stack {
      docker_image     = "sevenstones/game"
      docker_image_tag = "latest"
    }
  }
}
