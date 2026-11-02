/* Assignment 6 - jQuery interactions */
(function ($) {
  "use strict";

  if (!$) return;

  $(function () {
    console.log("jQuery is ready!");

    // Task 4: colorful scroll progress bar.
    $("body").prepend('<div class="scroll-progress" aria-hidden="true"><span></span></div>');
    function updateProgress() {
      var scrollTop = $(window).scrollTop();
      var documentHeight = $(document).height() - $(window).height();
      var progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
      $(".scroll-progress span").css("width", progress + "%");
    }
    $(window).on("scroll resize", updateProgress);
    updateProgress();

    // Task 1 + Task 2: live filtering and autocomplete suggestions.
    var $search = $("#member-search");
    var $members = $(".searchable-member");
    var suggestions = ["Mansur", "Erasyl", "Ansar", "Astana", "Shymkent", "Kosshy", "running", "football", "basketball", "web development"];

    function escapeRegExp(value) {
      return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function highlightText(query) {
      var $targets = $(".highlightable, .searchable-member p");
      $targets.each(function () {
        var $target = $(this);
        var original = $target.data("original-text");
        if (!original) {
          original = $target.text();
          $target.data("original-text", original);
        }
        if (!query) {
          $target.text(original);
          return;
        }
        var regex = new RegExp("(" + escapeRegExp(query) + ")", "ig");
        $target.html(original.replace(regex, "<mark>$1</mark>"));
      });
    }

    function filterMembers(query) {
      var normalized = String(query || "").trim().toLowerCase();
      $members.each(function () {
        var $member = $(this);
        var matches = !normalized || String($member.data("search")).toLowerCase().indexOf(normalized) !== -1;
        $member.toggle(matches);
      });
      highlightText(normalized);
      var $suggestions = $("#search-suggestions");
      if (!normalized) {
        $suggestions.empty().prop("hidden", true);
        return;
      }
      var matches = suggestions.filter(function (item) {
        return item.toLowerCase().indexOf(normalized) !== -1;
      }).slice(0, 5);
      $suggestions.empty();
      $.each(matches, function (_, item) {
        $("<li>").attr({ role: "option", tabindex: "0" }).text(item).appendTo($suggestions);
      });
      $suggestions.prop("hidden", matches.length === 0);
    }

    $search.on("keyup input", function () { filterMembers($(this).val()); });
    $("#search-suggestions").on("click keydown", "li", function (event) {
      if (event.type === "click" || event.key === "Enter") {
        $search.val($(this).text());
        filterMembers($search.val());
        $search.trigger("focus");
      }
    });

    // Task 5: animated number counters when they enter the viewport.
    var countersStarted = false;
    function animateCounters() {
      if (countersStarted || !$(".counter").length) return;
      var top = $(window).scrollTop() + $(window).height();
      var counterTop = $(".counter").first().offset().top;
      if (top < counterTop - 40) return;
      countersStarted = true;
      $(".counter").each(function () {
        var $counter = $(this);
        $({ value: 0 }).animate({ value: Number($counter.data("target")) }, {
          duration: 1200,
          easing: "swing",
          step: function () { $counter.text(Math.floor(this.value)); },
          complete: function () { $counter.text($counter.data("target")); }
        });
      });
    }
    $(window).on("scroll", animateCounters);
    animateCounters();

    // Task 6: loading spinner and disabled submit state.
    $("#contact-form, #validation-form, #subscription-form").on("submit", function (event) {
      var $form = $(this);
      var $button = $form.find('button[type="submit"]');
      if (!$button.length || (this.id !== "contact-form" && !this.checkValidity())) return;
      if (this.id === "contact-form") event.preventDefault();
      if ($button.data("loading")) return;
      $button.data("loading", true).prop("disabled", true).html('<span class="spinner" aria-hidden="true"></span> Please wait…');
      window.setTimeout(function () {
        $button.data("loading", false).prop("disabled", false).text("Отправить сообщение");
        showToast("Форма отправлена успешно");
      }, 900);
    });

    // Task 7: reusable fading notification toast.
    function showToast(message) {
      var $toast = $("#jquery-toast");
      if (!$toast.length) $toast = $('<div id="jquery-toast" class="jquery-toast" role="status"></div>').appendTo("body");
      $toast.stop(true, true).text(message).fadeIn(180).delay(2200).fadeOut(400);
    }
    $(".button-link").not('[href]').on("click", function () {
      if (this.id !== "change-background" && this.id !== "toggle-theme" && this.id !== "sound-toggle") showToast("Действие выполнено");
    });

    // Task 8: clipboard copy with icon and tooltip feedback.
    $(".copy-button").on("click", function () {
      var $button = $(this);
      var text = $($button.data("copy-target")).text();
      function copied() {
        $button.find(".copy-icon").text("✓");
        $button.find(".copy-label").text("Скопировано!");
        $button.attr("title", "Copied to clipboard!");
        showToast("Скопировано в буфер обмена");
        window.setTimeout(function () {
          $button.find(".copy-icon").text("⧉");
          $button.find(".copy-label").text("Копировать");
        }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(copied);
      } else {
        var $temporary = $("<textarea>").val(text).appendTo("body").select();
        document.execCommand("copy");
        $temporary.remove();
        copied();
      }
    });

    // Task 9: lazy loading using data-src and scroll position.
    function loadVisibleImages() {
      $("img[data-src]").each(function () {
        var $image = $(this);
        if (!$image.attr("src") && $image.offset().top < $(window).scrollTop() + $(window).height() + 180) {
          $image.attr("src", $image.data("src")).removeAttr("data-src");
        }
      });
    }
    $(window).on("scroll resize", loadVisibleImages);
    loadVisibleImages();
  });
}(window.jQuery));
