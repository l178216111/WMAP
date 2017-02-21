#!/usr/bin/perl
use MIME::Lite;
use DBI;
use Data::Dumper;
use POSIX;
use Time::Local;
use JSON;
use CGI;
use CGI::Session;
use Date::Calc qw(Decode_Month);
use CGI qw(:standard);
use Net::LDAP;
use INFAnalysis;
print "Content-type: application/json\n\n";
my $INFDir='/floor/data/results_map/';
my %output;
my $cgi=new CGI;
my %input;
$input{operate}=$cgi->param('operate');
if ( $input{operate} eq 'initial') {
	&initial;
}elsif($input{operate} eq 'select'){
	&select;
}
sub select{
	$input{part}=$cgi->param('part');
	$input{lot}=$cgi->param('lot');
	$input{wafer}=$cgi->param('wafer');
	$input{pass}=$cgi->param('pass');
	$input{change}=$cgi->param('change');
	if ($input{change} eq  'part'){
		my @lot;
		opendir(LOTDIR,$INFDir.$input{part});	
		@lot=grep { $_ ne '.' and $_ ne '..' } readdir LOTDIR;	
		close LOTDIR;
		$output{'list'}{'lot'}=\@lot;
	}elsif ($input{change} eq  'lot'){
		my @wafer;
                opendir(WAFERDIR,$INFDir.$input{part}."/".$input{lot}); 
                @wafer=grep { $_ ne '.' and $_ ne '..' } readdir WAFERDIR; 
                close WAFERDIR;
                $output{'list'}{'wafer'}=\@wafer;
	}elsif ($input{change} eq  'wafer'){
		my @pass;
		my $inf_obj = INFAnalysis->new();
		$inf_obj->LoadINF($INFDir.$input{part}."/".$input{lot}."/".$input{wafer});
		my @SmPass=$inf_obj->block('SmWaferFlow')->block('SmTestFlow')->blocks('SmPass');
		my @Pass;
		foreach my $SmPass (@SmPass) {
				push @Pass,$SmPass->key('MPN');
		}
		my @SmWaferPass=$inf_obj->block('SmWaferFlow')->blocks('SmWaferPass');
		foreach my $SmWaferPass (@SmWaferPass) {
				my %info;
				my $pass=$SmWaferPass->key('SESSION_NUM');
				my $abandoned=$SmWaferPass->{'name'};
				$info{'SESSION_NUM'}=$Pass[$pass-1];
				$info{'STTI'}=&transtime($SmWaferPass->key('STTI'));
				$info{'PASS_TYPE'}=$SmWaferPass->key('PASS_TYPE');
				if ($abandoned =~/Abandoned/){
						$abandoned='Abandoned,';
				}else{
						$abandoned='';
				}
				my $info="$abandoned$info{'SESSION_NUM'},$info{'STTI'},$info{'PASS_TYPE'}";
				push @pass,$info;
		}
		unshift @pass,'Current Wafer State';
		$output{'list'}{'pass'}=\@pass;
	}
}
sub transtime{
	my $time=shift;
	my @time=split(/\s/,$time);
	my $MM=Decode_Month("$time[1]",1);
	return "$time[4]-$MM-$time[2] $time[3]"
}
sub initial{
	my @part;
	opendir(PARTDIR,$INFDir);
	@part=grep { $_ ne '.' and $_ ne '..' } readdir PARTDIR;
	close PARTDIR;
	$output{'list'}{'part'}=\@part;
        $output{'list'}{'lot'}="";
        $output{'list'}{'wafer'}="";
        $output{'list'}{'pass'}="";
}
my $json=to_json(\%output);
print "$json";
