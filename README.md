# Project-BD
## Projekt koncepcji, założenia
### Temat projektu
Projekt pt. “Zarządzanie Bocznicą” przeznaczony jest do obsługi bocznicy użytkownika.
Jego celem jest możliwość wprowadzania nowych bocznic, torów na bocznicach oraz
wprowadzanie wagonów wjeżdżających i wyjeżdżających z bocznicy. Dodatkową 
funkcjonalnością jest obliczanie zajętości toru, czyli jak dużo wolnego toru
zostało dla wagonów oraz wyliczanie podsumowania jak długo wagony danej firmy
przebywały na bocznicach użytkownika i ile dana firma musi zapłacić po 
uwzględnieniu określonej stawki za przebywanie na torze.

### Analiza wymagań użytkownika
Dla użytkownika zarządzania bocznicą konieczne są z pewnością następujące funkcjonalności:
*	Przegląd swoich bocznic, torów, wagonów na torze oraz możliwość dostępu do tabeli wagonów
  bazowych która zawiera informacje ogólne o wagonach dla jakiegoś przedziału numerów wagonów.
  Oraz dostęp do list firm
*	Informacje o torach użytkownika, ile jeszcze zostało nam toru do wykorzystania
*	możliwość podsumowania czasu wagonów na torze

### Zaprojektowanie funkcji
Podstawowe	funkcje	programu	są realizowane zgodnie z powyższymi wymogami użytkownika i są
podzielone funkcjonalnie na trzy połączone ze sobą działy:
*	Wprowadzanie i przegląd swoich bocznic, torów, oraz wagonów na torze, możliwość dodania danych firmy do użytkownika oraz do wagonów
*	Informacja o torach zwracająca zajętość toru
*	Podsumowanie czasu wagonów na torze wykorzystując id użytkownika

## Projekt diagramów
Diagram ERD przedstawiony jest na poniższej ilustracji (rys.1) i pokazuje wszystkie encje
programu wraz z realizacją połączeń między nimi oraz zawartymi w encjach kluczami.

![Schemat ERD](https://github.com/whistlee/Project-BD/README-IMAGES/Img1.png)
