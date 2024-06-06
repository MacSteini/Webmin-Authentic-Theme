#!/usr/local/bin/perl

#
# Authentic Theme (https://github.com/authentic-theme/authentic-theme)
# Copyright Ilia Rostovtsev <ilia@virtualmin.com>
# Licensed under MIT (https://github.com/authentic-theme/authentic-theme/blob/master/LICENSE)
#
use strict;

require($ENV{'THEME_ROOT'} . "/stats-lib.pl");
our ($config_directory, $current_theme, $root_directory, $var_directory, %text);

# Check access
init_prefail();
if (!defined(&webmin_user_is_admin) || !webmin_user_is_admin()) {
    print_json({ error => $text{'index_noadmin_eaccess'}, access => 0 });
    exit;
}

# Check dependencies
my @errors;
my @modnames = ("Digest::SHA", "Digest::MD5", "IO::Select",
                "Time::HiRes", "Net::WebSocket::Server");

foreach my $modname (@modnames) {
    eval "use ${modname};";
    if ($@) {
        push(@errors, $@, $modname);
        push(@errors, text('index_mods_missing', $modname));
        last;
    }
}
if (@errors) {
    print_json({ error => $errors[2], 
                 error_module => $errors[1],
                 error_stack => $errors[0] });
    exit;
}

# Get the log file
my $get_logfile = sub {
    my ($port) = @_;
    return "$var_directory/modules/$current_theme/stats-server-$port.log";
};

# Get the socket URL
my $get_socket = sub {
    my ($port) = @_;
    my $ws_proto = lc($ENV{'HTTPS'}) eq 'on' ? 'wss' : 'ws';
    my $http_host = "$ws_proto://$ENV{'HTTP_HOST'}";
    my $url = "$http_host/$current_theme/ws-$port";
};

# Do we have an active socket?
my %miniserv;
&get_miniserv_config(\%miniserv);
foreach my $k (keys %miniserv) {
    if ($k =~ /^websockets_\/$current_theme\/ws-(\d+)$/) {
        print_json({ success => 1, port => $1, new => 0,
                     socket => $get_socket->($1),
                     errlog => $get_logfile->($1) });
        exit;
    }
}

# Allocate port
my $port = &allocate_miniserv_websocket($current_theme);

# Launch the stats server
my $server_name = "stats.pl";
my $statsserver_cmd = "$config_directory/$current_theme/$server_name";
&create_wrapper($statsserver_cmd, $current_theme, $server_name)
    if (!-r $statsserver_cmd);

# Launch the server
my $logfile = $get_logfile->($port);
my $rs = &system_logged(
    "SESSION_ID=$main::session_id ".
    "$statsserver_cmd @{[quotemeta($port)]} ".
    ">$logfile 2>&1 </dev/null &");
print_json({ success => !$rs, port => $port,
             socket => $get_socket->($port),
             new => 1, errlog => $logfile });
